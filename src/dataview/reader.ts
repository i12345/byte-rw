import { ByteReader } from "../interfaces/index.js"
import { copy } from "../utils/copy.js"

export class DataViewByteReader implements ByteReader {
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

    /**
     * Gets the next Float32 value
     */
    getFloat32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getFloat32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Float64 value
     */
    getFloat64(): number {
        const bytes = 8
        this.ensureAvailable(bytes)
        const value = this._dataview.getFloat64(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int8 value
     */
    getInt8(): number {
        const bytes = 1
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int16 value
     */
    getInt16(): number {
        const bytes = 2
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int32 value
     */
    getInt32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint8 value
     */
    getUint8(): number {
        const bytes = 1
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }
    
    /**
     * Gets the next Uint16 value
     */
    getUint16(): number {
        const bytes = 2
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint32 value
     */
    getUint32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    getBytes(buffer: ArrayBufferView): void {
        const bytes = buffer.byteLength
        this.ensureAvailable(bytes)

        const dst = buffer.buffer
        const src = this._dataview.buffer
    
        const dstOffset = buffer.byteOffset
        const srcOffset = this._dataview.byteOffset + this._byteOffset

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

        this._byteOffset += bytes
    }
}