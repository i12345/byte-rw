import { copy } from "../utils/copy.js";
import { DataViewChunk, DataViewChunkedWorker } from "./dataview-chunk.js";
import { DataViewByteReader } from "./reader.js";

export abstract class DataViewByteReaderChunked extends DataViewByteReader implements DataViewChunkedWorker {
    protected pendingChunks: DataViewChunk[] = []
    private _currentChunk: DataViewChunk

    protected get currentChunk() {
        return this._currentChunk
    }

    protected set currentChunk(currentChunk) {
        this._currentChunk = currentChunk
        this._dataview = currentChunk.view instanceof DataView ?
            currentChunk.view :
            new DataView(
                currentChunk.view.buffer,
                currentChunk.view.byteOffset,
                currentChunk.view.byteLength
            )
    }

    protected get _bytesRemaining() {
        let remaining = this._bytesRemaining_currentChunk
        for (const pendingChunk of this.pendingChunks)
            remaining += pendingChunk.bytesWritten
        return remaining
    }

    protected get _bytesRemaining_currentChunk() {
        return this.currentChunk.bytesWritten - this._byteOffset
    }

    constructor(
        littleEndian?: boolean,
        public defaultChunkSize = 4096
    ) { 
        super(new DataView(new ArrayBuffer(defaultChunkSize)), littleEndian)
        
        this._currentChunk = {
            view: this._dataview,
            bytesWritten: 0
        }
    }
    
    /**
     * Fills more data to be read into the current chunk and possibly pending
     * chunks, adding more pending chunk(s) if needed
     * 
     * @param minReadLength the minimum number of bytes to read into the
     * current and/or pending chunks
     * @returns the number of bytes that were actually filled
     */
    protected abstract fill(minReadLength: number): number

    protected pendChunk(chunk?: DataViewChunk) {
        chunk ??= {
            view: {
                buffer: new ArrayBuffer(this.defaultChunkSize),
                byteOffset: 0,
                byteLength: this.defaultChunkSize
            },
            bytesWritten: 0
        }
        this.pendingChunks.push(chunk)

        return chunk
    }

    /**
     * Attempts to ensure that a specified number of bytes are available in the
     * current chunk.
     * 
     * @param bytes the number of bytes to fill (total bytesWritten should
     * increase by this amount at least)
     * @returns the number of bytes at least made available in the current
     * chunk, up to the requested number of bytes
     */
    protected tryEnsureAvailable(bytes: number): number {
        if (bytes <= this._bytesRemaining_currentChunk)
            return bytes
        
        function resizeCurrentChunk(this: DataViewByteReaderChunked, size: number) {
            const currentChunk_length = this._bytesRemaining_currentChunk
            if (currentChunk_length >= size)
                return size
            
            const tmpChunk_buffer = new ArrayBuffer(size)
            let tmpChunk_bytesWritten = 0

            copy(
                {
                    buffer: this.currentChunk.view.buffer,
                    byteOffset: this.currentChunk.view.byteOffset + this._byteOffset,
                    byteLength: currentChunk_length
                },
                {
                    buffer: tmpChunk_buffer,
                    byteOffset: 0,
                    byteLength: currentChunk_length
                }
            )
            tmpChunk_bytesWritten += currentChunk_length

            while (tmpChunk_bytesWritten < size) {
                const pendingChunk = this.pendingChunks.shift()
                
                if (!pendingChunk)
                    break
                
                const toCopy = Math.min(pendingChunk.bytesWritten, size - tmpChunk_bytesWritten)

                copy(
                    {
                        buffer: pendingChunk.view.buffer,
                        byteOffset: pendingChunk.view.byteOffset,
                        byteLength: toCopy
                    },
                    {
                        buffer: tmpChunk_buffer,
                        byteOffset: tmpChunk_bytesWritten,
                        byteLength: toCopy
                    }
                )

                if (toCopy < pendingChunk.bytesWritten) {
                    this.pendingChunks.unshift({
                        view: {
                            buffer: pendingChunk.view.buffer,
                            byteOffset: pendingChunk.view.byteOffset + toCopy,
                            byteLength: pendingChunk.view.byteLength + toCopy
                        },
                        bytesWritten: pendingChunk.bytesWritten + toCopy,
                    })
                }

                tmpChunk_bytesWritten += toCopy
            }

            this.currentChunk = {
                view: {
                    buffer: tmpChunk_buffer,
                    byteOffset: 0,
                    byteLength: size
                },
                bytesWritten: tmpChunk_bytesWritten
            }
            this._byteOffset = 0

            return tmpChunk_bytesWritten
        }

        if (this._bytesRemaining_currentChunk === 0) {
            const pendingChunk = this.pendingChunks.shift()
            if (pendingChunk) {
                if (pendingChunk.bytesWritten < bytes)
                    this.pendingChunks.unshift(pendingChunk)
                else {
                    this.currentChunk = pendingChunk
                    this._byteOffset = 0
                    return bytes
                }
            }
            
            this.fill(bytes - this._bytesRemaining)
            return resizeCurrentChunk.call(this, bytes)
        }
        else {
            const toFill = bytes - this._bytesRemaining
            this.fill(toFill)
            return resizeCurrentChunk.call(this, bytes)
        }
    }

    tryGetBytes(view: ArrayBufferView): number {
        let read = 0

        function copyFromCurrentChunk(this: DataViewByteReaderChunked) {
            const toCopy_remaining = view.byteLength - read
            const toCopy = Math.min(this._bytesRemaining_currentChunk, toCopy_remaining)

            copy(
                {
                    buffer: this.currentChunk.view.buffer,
                    byteOffset: this.currentChunk.view.byteOffset + this._byteOffset,
                    byteLength: toCopy
                },
                {
                    buffer: view.buffer,
                    byteOffset: view.byteOffset,
                    byteLength: toCopy
                }
            )

            read += toCopy
            this._byteOffset += toCopy
        }

        if (this._bytesRemaining_currentChunk > 0) 
            copyFromCurrentChunk.call(this)

        while (read < view.byteLength &&
            this.pendingChunks.length > 0) {
            this.currentChunk = this.pendingChunks.shift()!
            this._byteOffset = 0
            copyFromCurrentChunk.call(this)
        }

        if (read < view.byteLength) {
            this.currentChunk = {
                view,
                bytesWritten: read
            }
            
            const toFill = view.byteLength - read
            const filled = this.fill(toFill)
            read += Math.min(toFill, filled)

            if (this.pendingChunks.length === 0)
                this.pendChunk()
            this.currentChunk = this.pendingChunks.shift()!
            this._byteOffset = 0
        }

        return read
    }
}