import { copy } from "../utils/copy.js";
import { DataViewChunk } from "./dataview-chunk.js";
import { DataViewByteWriterChunked } from "./writer-chunked.js";

export class DataViewByteWriterChunkedDynamic extends DataViewByteWriterChunked {
    chunks: DataViewChunk[] = []
    
    combineChunks() {
        this.complete()

        const offsets = new Array<number>(this.chunks.length + 1)
        offsets[0] = 0
        for (let i = 1; i < offsets.length; i++)
            offsets[i] = offsets[i - 1] + this.chunks[i - 1].bytesWritten
        
        const dst = new ArrayBuffer(offsets.pop()!)
        for (let i = 0; i < offsets.length; i++) {
            const chunk = this.chunks[i]

            copy(
                {
                    buffer: chunk.view.buffer,
                    byteOffset: chunk.view.byteOffset,
                    byteLength: chunk.bytesWritten
                },
                {
                    buffer: dst,
                    byteOffset: offsets[i],
                    byteLength: chunk.bytesWritten
                }
            )
        }

        return dst
    }

    constructor(
        littleEndian?: boolean,
        defaultChunkSize = 4096
    ) {
        super(littleEndian, defaultChunkSize)
    }

    protected save(): number {
        this.chunks.push({
            view: this._dataview,
            bytesWritten: this._byteOffset
        })
        return this._byteOffset
    }
}