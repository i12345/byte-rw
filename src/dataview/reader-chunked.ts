import { copy } from "../utils/copy.js";
import { DataViewChunk, DataViewChunkedWorker } from "./dataview-chunk.js";
import { DataViewByteReader } from "./reader.js";

export abstract class DataViewByteReaderChunked extends DataViewByteReader implements DataViewChunkedWorker {
    protected chunks: DataViewChunk[] = []
    protected currentChunk: DataViewChunk

    protected get _bytesRemaining() {
        return this.currentChunk.bytesWritten - this._byteOffset
    }

    constructor(
        littleEndian?: boolean,
        public readonly minChunkSize = 4096
    ) { 
        super(new DataView(new ArrayBuffer(minChunkSize)), littleEndian)
        
        this.currentChunk = {
            buffer: this._dataview.buffer,
            bytesWritten: 0
        }
        this.chunks.push(this.currentChunk)
    }

    protected abstract fillChunk(
        chunk: DataViewChunk,
        minReadLength: number
    ): void

    protected newChunkWithFreeSpace(space: number) {
        const oldChunk = this.chunks[this.chunks.length - 1]
        const oldChunk_lastRead = this._byteOffset
        const oldChunk_bytesRemainingToRead = this._bytesRemaining
        
        const newChunk_size = Math.max(this.minChunkSize, space + oldChunk_bytesRemainingToRead)
        const newChunk_buffer = new ArrayBuffer(newChunk_size)
        
        copy(
            {
                buffer: oldChunk.buffer,
                byteOffset: oldChunk_lastRead,
                byteLength: oldChunk_bytesRemainingToRead
            },
            {
                buffer: newChunk_buffer,
                byteOffset: 0,
                byteLength: oldChunk_bytesRemainingToRead
            }
        )

        const newChunk: DataViewChunk = {
            buffer: newChunk_buffer,
            bytesWritten: oldChunk_bytesRemainingToRead
        }
        this.chunks.push(newChunk)
        this.currentChunk = newChunk

        this._dataview = new DataView(newChunk.buffer)
        this._byteOffset = 0
    }

    protected ensureAvailable(bytes: number): void {
        if (bytes > this._bytesRemaining) {
            if ((this.currentChunk.buffer.byteLength - this._byteOffset) < bytes)
                this.newChunkWithFreeSpace(bytes)
            this.fillChunk(this.currentChunk, bytes)
        }
    }

    getBytes(buffer: ArrayBufferView): void {
        let read = this._byteOffset

        while (read < buffer.byteLength) {
            const toRead = Math.min(buffer.byteLength - read, this.minChunkSize)
            this.ensureAvailable(toRead)
            
            copy(
                {
                    buffer: this.currentChunk.buffer,
                    byteOffset: this._byteOffset,
                    byteLength: toRead
                },
                {
                    buffer: buffer.buffer,
                    byteOffset: buffer.byteOffset + read,
                    byteLength: toRead
                }
            )

            read += toRead
            this._byteOffset += toRead
        }
    }
}