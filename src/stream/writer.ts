import { DataViewByteWriterAsyncChunked } from "../dataview/index.js";

export class StreamByteWriter extends DataViewByteWriterAsyncChunked {
    private readonly writer
    
    constructor(
        public readonly stream: WritableStream,
        littleEndian = true,
        defaultChunkSize?: number
    ) {
        super(littleEndian, defaultChunkSize)
        this.writer ??= stream.getWriter()

        if (defaultChunkSize === undefined && this.writer.desiredSize)
            this.defaultChunkSize = this.writer.desiredSize
    }
    
    async complete() {
        await super.complete()

        await this.writer.ready
        await this.writer.close()
    }

    protected async save(): Promise<number> {
        const view = this._byteOffset === this._dataview.byteLength ?
            this._dataview :
            new DataView(
                this._dataview.buffer,
                this._dataview.byteOffset,
                this._byteOffset
            )
        
        await this.writer.write(view)
        
        return this._byteOffset
    }
}