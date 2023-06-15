import { DataViewChunk } from "../dataview/dataview-chunk.js"
import { DataViewByteReaderAsyncChunked } from "../dataview/index.js"
import { copy } from "../utils/copy.js"

export class StreamByteReader extends DataViewByteReaderAsyncChunked {
    private readonly reader
    private readonly isByob: boolean

    constructor(
        public readonly stream: ReadableStream,
        littleEndian = true,
        defaultChunkSize = 4096
    ) {
        super(littleEndian, defaultChunkSize)
        try {
            this.reader = stream.getReader({ mode: "byob" })
            this.isByob = true
        }
        catch {
            this.reader = stream.getReader()
            this.isByob = false
        }
    }

    protected async fill(minReadLength: number): Promise<number> {
        if (minReadLength === 0)
            return 0

        let chunk = this.currentChunk
        let i_chunk = 0
        while (chunk.view.byteLength - chunk.bytesWritten === 0)
            chunk = this.pendingChunks[i_chunk++]

        let filled = 0
        while (minReadLength > 0) {
            const availableLength = chunk.view.byteLength - chunk.bytesWritten
            const toRead = Math.min(availableLength, minReadLength)
            const view = this.isByob ? new DataView(
                chunk.view.buffer,
                chunk.view.byteOffset + chunk.bytesWritten,
                toRead
            ) : undefined!
            const read = await this.reader.read(view)

            if (read.done) {
                this._isComplete = true
                break
            }

            const readView = read.value as ArrayBufferView
            filled += readView.byteLength

            const toCopy = Math.min(availableLength, readView.byteLength)
            if (!this.isByob) {
                copy(
                    {
                        buffer: readView.buffer,
                        byteOffset: readView.byteOffset,
                        byteLength: toCopy
                    },
                    {
                        buffer: chunk.view.buffer,
                        byteOffset: chunk.view.byteOffset + chunk.bytesWritten,
                        byteLength: toCopy
                    }
                )
            }
            chunk.bytesWritten += toCopy

            const toSave = readView.byteLength - toCopy
            if (toSave > 0) {
                console.assert(!this.isByob)

                this.pendChunk({
                    view: {
                        buffer: readView.buffer,
                        byteOffset: readView.byteOffset + toCopy,
                        byteLength: readView.byteLength - toCopy
                    },
                    bytesWritten: toSave
                })
            }

            minReadLength -= readView.byteLength
        }

        return filled
    }
}