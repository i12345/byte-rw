import { DataViewChunkedWorker } from "./dataview-chunk.js";
import { DataViewByteWriterAsync } from "./writer-async.js";

export abstract class DataViewByteWriterAsyncChunked extends DataViewByteWriterAsync implements DataViewChunkedWorker {
    constructor(
        littleEndian?: boolean,
        public defaultChunkSize = 4096
    ) {
        super(new DataView(new ArrayBuffer(defaultChunkSize)), littleEndian)
    }

    async complete(): Promise<void> {
        const toSave = this._byteOffset
        const saved = await this.save()
        if (saved != toSave)
            throw new Error("not all queued bytes could be saved")

        await super.complete()
    }

    /**
     * Saves the current chunk ({@link dataview}) and returns the number
     * of bytes that were saved
     */
    protected abstract save(): Promise<number>

    protected async tryEnsureAvailable(bytes: number): Promise<number> {
        if (this._isComplete)
            return 0
        
        if (this._bytesRemaining < bytes) {
            const saved = await this.save()
            if (saved !== this._dataview.byteLength) {
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