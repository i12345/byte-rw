import { DataViewChunk } from "../dataview/dataview-chunk.js"
import { DataViewByteReaderAsyncChunked } from "../dataview/index.js"
import { copy } from "../utils/copy.js"

export class StreamByteReader extends DataViewByteReaderAsyncChunked {
    private readonly reader
    private readonly isByob: boolean

    constructor(
        public readonly stream: ReadableStream,
        littleEndian = true,
        public readonly minChunkSize = 4096
    ) {
        super(littleEndian, minChunkSize)
        try {
            this.reader = stream.getReader({ mode: "byob" })
            this.isByob = true
        }
        catch {
            this.reader = stream.getReader()
            this.isByob = false
        }
    }

    protected async fillChunk(chunk: DataViewChunk, minReadLength: number): Promise<void> {
        const view = this.isByob ? new DataView(chunk.buffer, chunk.bytesWritten, minReadLength) : undefined!
        const read = await this.reader.read(view)
        
        if (read.done)
            throw new Error("end of stream")
        
        if (this.isByob)
            chunk.bytesWritten += view.byteLength
        else {
            const readView = read.value as ArrayBufferView

            copy(
                readView,
                {
                    buffer: chunk.buffer,
                    byteOffset: chunk.bytesWritten,
                    byteLength: readView.byteLength
                }
            )

            chunk.bytesWritten += readView.byteLength
        }
    }
}