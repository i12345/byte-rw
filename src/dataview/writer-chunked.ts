import { DataViewChunkedWorker } from "./dataview-chunk.js";
import { DataViewByteWriter } from "./writer.js";

export abstract class DataViewByteWriterChunked extends DataViewByteWriter implements DataViewChunkedWorker {
    constructor(
        littleEndian?: boolean,
        public defaultChunkSize = 4096
    ) {
        super(new DataView(new ArrayBuffer(defaultChunkSize)), littleEndian)
    }

    complete(): void {
        if (this._isComplete)
            return

        const toSave = this._byteOffset
        const saved = this.save()
        if (saved != toSave)
            throw new Error("not all queued bytes could be saved")

        this._dataview = new DataView(new ArrayBuffer(0))
        this._byteOffset = 0
        
        super.complete()
    }

    /**
     * Saves the current chunk ({@link dataview}) and returns the number
     * of bytes that were saved
     */
    protected abstract save(): number

    protected tryEnsureAvailable(bytes: number): number {
        if (this._isComplete)
            return 0
        
        if (this._bytesRemaining < bytes) {
            const saved = this.save()
            if (saved !== this._byteOffset) {
                this._isComplete = true
                return 0
            }
            else {
                this._dataview = new DataView(new ArrayBuffer(Math.max(bytes, this.defaultChunkSize)))
                this._byteOffset = 0
            }
        }

        return bytes
    }
}