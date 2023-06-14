import { ByteReaderAsync } from "../interfaces/index.js"
import { copy } from "../utils/copy.js"

export class DataViewByteReaderAsync implements ByteReaderAsync {
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

    protected async ensureAvailable(bytes: number): Promise<void> {
        if (this._bytesRemaining < bytes)
            throw new Error(`${this._bytesRemaining} bytes left; ${bytes} bytes needed`)
    }

    /**
     * Gets the next Float32 value
     */
    async getFloat32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getFloat32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Float64 value
     */
    async getFloat64(): Promise<number> {
        const bytes = 8
        await this.ensureAvailable(bytes)
        const value = this._dataview.getFloat64(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int8 value
     */
    async getInt8(): Promise<number> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int16 value
     */
    async getInt16(): Promise<number> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int32 value
     */
    async getInt32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint8 value
     */
    async getUint8(): Promise<number> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }
    
    /**
     * Gets the next Uint16 value
     */
    async getUint16(): Promise<number> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint32 value
     */
    async getUint32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    async getBytes(buffer: ArrayBufferView): Promise<void> {
        const bytes = buffer.byteLength
        await this.ensureAvailable(bytes)

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
    }
}