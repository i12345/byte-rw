import { ByteReaderAsync } from "../interfaces/index.js"
import { copy, textDecoder } from "../utils/index.js"

export class DataViewByteReaderAsync implements ByteReaderAsync {
    protected _dataview: DataView
    protected _isComplete: boolean = false

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

    async isComplete(): Promise<boolean> {
        return this._isComplete ||= await this.updateIsComplete()
    }

    constructor(
        dataview: DataView,
        public littleEndian = true
    ) {
        this._dataview = dataview
    }

    protected async updateIsComplete(): Promise<boolean> {
        return (await this.tryEnsureAvailable(1)) > 0
    }

    /**
     * Attempts to ensure that a specified number of bytes are available in the
     * current chunk.
     * 
     * @param bytes the number of bytes to request in the current chunk
     * @returns the number of bytes at least made available in the current
     * chunk, up to the requested number of bytes
     */
    protected async tryEnsureAvailable(bytes: number): Promise<number> {
        if (this._isComplete)
            return 0

        if (this._bytesRemaining < bytes)
            return this._bytesRemaining
        else
            return bytes
    }

    protected async ensureAvailable(bytes: number): Promise<void> {
        const available = await this.tryEnsureAvailable(bytes)

        if (available !== bytes)
            throw new Error(`Not all bytes could be available (${bytes} bytes request, ${available} bytes available)`)
    }

    /**
     * Gets the next Float32 value
     */
    async readFloat32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getFloat32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Float64 value
     */
    async readFloat64(): Promise<number> {
        const bytes = 8
        await this.ensureAvailable(bytes)
        const value = this._dataview.getFloat64(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int8 value
     */
    async readInt8(): Promise<number> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int16 value
     */
    async readInt16(): Promise<number> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int32 value
     */
    async readInt32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getInt32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint8 value
     */
    async readUint8(): Promise<number> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }
    
    /**
     * Gets the next Uint16 value
     */
    async readUint16(): Promise<number> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint32 value
     */
    async readUint32(): Promise<number> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        const value = this._dataview.getUint32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    async tryReadBytes(view: ArrayBufferView): Promise<number> {
        const bytes = view.byteLength
        const read = await this.tryEnsureAvailable(bytes)

        const dst = view.buffer
        const src = this._dataview.buffer
    
        const dstOffset = view.byteOffset
        const srcOffset = this._dataview.byteOffset + this._byteOffset

        copy(
            {
                buffer: src,
                byteOffset: srcOffset,
                byteLength: read,
            },
            {
                buffer: dst,
                byteOffset: dstOffset,
                byteLength: read,
            }
        )

        return read
    }

    async readBytes(view: ArrayBufferView): Promise<void> {
        const read = await this.tryReadBytes(view)
        if (read !== view.byteLength)
            throw new Error(`Not all bytes could be read (${view.byteLength} bytes request, ${read} bytes read)`)
    }

    async getString(encoding?: string): Promise<string> {
        const length = await this.readUint32()

        await this.ensureAvailable(length)
        
        const available = this._dataview.byteLength - this._byteOffset
        console.assert(available >= length)

        const view = new DataView(
            this._dataview.buffer,
            this._dataview.byteOffset + this._byteOffset,
            length
        )

        return textDecoder.decode(view)
    }
}