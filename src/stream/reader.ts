import { DataViewByteReaderAsync } from "../dataview/reader-async.js"

export class StreamByteReader extends DataViewByteReaderAsync {
    private readonly reader

    constructor(
        public readonly stream: ReadableStream,
        littleEndian = true,
        public readonly defaultBufferSize = 4096
    ) {
        super(new DataView(new ArrayBuffer(defaultBufferSize)), littleEndian)
        this.reader = stream.getReader({ mode: "byob" })
    }

    protected async ensureAvailable(bytes: number): Promise<void> {
        const result = await this.reader.read(this._dataview)
        if (result.done) {
            if (bytes > 0)
                throw new Error("end of stream reached")
        }
        else {
            result.value?.byteLength

            console.log("this._dataview.byteOffset")
            console.log(this._dataview.byteOffset)
            console.log("this._dataview.byteLength")
            console.log(this._dataview.byteLength)
            console.log("result.value.byteOffset")
            console.log(result.value.byteOffset)
            console.log("result.value.byteLength")
            console.log(result.value.byteLength)
            
            debugger
        }
    }
}