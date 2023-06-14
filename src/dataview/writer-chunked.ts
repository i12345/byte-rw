import { copy } from "../utils/copy.js";
import { DataViewChunk, DataViewChunkedWorker } from "./dataview-chunk.js";
import { DataViewByteWriter } from "./writer.js";

export class DataViewByteWriterChunked extends DataViewByteWriter implements DataViewChunkedWorker {
    protected chunks: DataViewChunk[] = []
    protected currentChunk: DataViewChunk

    constructor(
        littleEndian = true,
        public minChunkSize = 4096
    ) {
        super(new DataView(new ArrayBuffer(minChunkSize)), littleEndian)
        this.currentChunk = {
            buffer: this._dataview.buffer,
            bytesWritten: 0
        }
        this.chunks.push(this.currentChunk)
    }

    get dataview() {
        return new DataView(this.combineChunks())
    }
    
    set dataview(dataview) {
        throw new Error("cannot set the dataview")
    }

    setBytes(buffer: ArrayBufferView): void {
        
    }

    protected ensureAvailable(bytes: number): void {
        if (this._bytesRemaining < bytes)
            this.newChunk(Math.max(bytes, this.minChunkSize))
    }

    protected newChunk(size: number) {
        this.currentChunk.bytesWritten = this._byteOffset
        
        const newChunk = {
            buffer: new ArrayBuffer(size),
            bytesWritten: 0
        }
        this.chunks.push(newChunk)

        this.currentChunk = newChunk
        this._dataview = new DataView(newChunk.buffer)
        this._byteOffset = 0
    }

    combineChunks() {
        this.currentChunk.bytesWritten = this._byteOffset

        const offsets = new Array<number>(this.chunks.length + 1)
        offsets[0] = 0
        for (let i = 1; i < offsets.length; i++)
            offsets[i] = offsets[i - 1] + this.chunks[i - 1].bytesWritten
        
        const dst = new ArrayBuffer(offsets.pop()!)
        for (let i = 0; i < offsets.length; i++) {
            const chunk = this.chunks[i]

            copy(
                {
                    buffer: chunk.buffer,
                    byteOffset: 0,
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
}