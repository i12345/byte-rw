import { ByteWriter } from "../interfaces/writer.js";
import { copy } from "../utils/copy.js";

export class DataViewByteWriter implements ByteWriter {
    protected _dataview: DataView

    protected _byteOffset = 0
    
    protected get _bytesRemaining() {
        return this._dataview.byteLength - this._byteOffset
    }

    get dataview() {
        return this._dataview
    }

    set dataview(dataview) {
        this._dataview = dataview
    }

    constructor(
        dataview: DataView,
        public littleEndian = true
    ) { 
        this._dataview = dataview
    }

    protected ensureAvailable(bytes: number) {
        if (this._bytesRemaining < bytes)
            throw new Error(`${this._bytesRemaining} bytes left; ${bytes} bytes needed`)
    }

    setFloat32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setFloat32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setFloat64(value: number): void {
        const bytes = 8
        this.ensureAvailable(bytes)
        this._dataview.setFloat64(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setInt8(value: number): void {
        const bytes = 1
        this.ensureAvailable(bytes)
        this._dataview.setInt8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    setInt16(value: number): void {
        const bytes = 2
        this.ensureAvailable(bytes)
        this._dataview.setInt16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setInt32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setInt32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setUint8(value: number): void {
        const bytes = 1
        this.ensureAvailable(bytes)
        this._dataview.setUint8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    setUint16(value: number): void {
        const bytes = 2
        this.ensureAvailable(bytes)
        this._dataview.setUint16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setUint32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setUint32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    setBytes(buffer: ArrayBufferView): void {
        const bytes = buffer.byteLength
        this.ensureAvailable(bytes)

        const dst = this._dataview.buffer
        const src = buffer.buffer
    
        const dstOffset = this._dataview.byteOffset + this._byteOffset
        const srcOffset = buffer.byteOffset

        copy(
            {
                buffer: src,
                byteOffset: srcOffset,
                byteLength: bytes,
            },
            {
                buffer: dst,
                byteOffset: dstOffset,
                byteLength: bytes,
            }
        )
    }
}