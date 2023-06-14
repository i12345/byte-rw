import { copy } from "../utils/copy.js";
import { DataViewByteWriter } from "./writer.js";

export interface DataViewByteWriterDynamicBucket {
    buffer: ArrayBuffer
    bytesWritten: number
}

export class DataViewByteWriterDynamic extends DataViewByteWriter {
    protected buckets: DataViewByteWriterDynamicBucket[] = []
    protected currentBucket = 0

    constructor(
        littleEndian = true,
        public defaultBufferSize = 4096
    ) {
        super(new DataView(new ArrayBuffer(defaultBufferSize)), littleEndian)
        this.buckets.push({
            buffer: this._dataview.buffer,
            bytesWritten: 0
        })
    }

    get dataview() {
        return new DataView(this.combineBuckets())
    }
    
    set dataview(dataview) {
        throw new Error("cannot set the dataview")
    }

    protected ensureAvailable(bytes: number): void {
        if (this._bytesRemaining < bytes)
            this.newBucket(Math.max(bytes, this.defaultBufferSize))
    }

    protected newBucket(size: number) {
        this.buckets[this.currentBucket].bytesWritten = this._byteOffset
        this.currentBucket++
        this.buckets.push({
            buffer: new ArrayBuffer(size),
            bytesWritten: 0
        })
        this._dataview = new DataView(this.buckets[this.currentBucket].buffer)
        this._byteOffset = 0
    }

    combineBuckets() {
        this.buckets[this.buckets.length - 1].bytesWritten = this._byteOffset

        const offsets = new Array<number>(this.buckets.length + 1)
        offsets[0] = 0
        for (let i = 1; i < offsets.length; i++)
            offsets[i] = offsets[i - 1] + this.buckets[i - 1].bytesWritten
        
        const dst = new ArrayBuffer(offsets.pop()!)
        for (let i = 0; i < offsets.length; i++) {
            const bucket = this.buckets[i]

            copy(
                {
                    buffer: bucket.buffer,
                    byteOffset: 0,
                    byteLength: bucket.bytesWritten
                },
                {
                    buffer: dst,
                    byteOffset: offsets[i],
                    byteLength: bucket.bytesWritten
                }
            )
        }

        return dst
    }
}