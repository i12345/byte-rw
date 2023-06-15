import { ByteWriterAsync } from "../index.js";
import { copy } from "../utils/copy.js";

export class DataViewByteWriterAsync implements ByteWriterAsync {
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

    async complete(): Promise<void> {
        this._isComplete = true
    }

    /**
     * Attempts to ensure that a specified number of bytes are available in the
     * current dataview.
     * 
     * @param bytes the number of bytes to request available in the current
     * dataview
     * @returns the number of bytes at least made available in the current
     * dataview, up to the requested number of bytes
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
        const read = await this.tryEnsureAvailable(bytes)

        if (read !== bytes)
            throw new Error(`Not all bytes could be available (${bytes} bytes requested, ${read} bytes available)`)
    }

    async setFloat32(value: number): Promise<void> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        this._dataview.setFloat32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async setFloat64(value: number): Promise<void> {
        const bytes = 8
        await this.ensureAvailable(bytes)
        this._dataview.setFloat64(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async setInt8(value: number): Promise<void> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        this._dataview.setInt8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    async setInt16(value: number): Promise<void> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        this._dataview.setInt16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async setInt32(value: number): Promise<void> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        this._dataview.setInt32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async setUint8(value: number): Promise<void> {
        const bytes = 1
        await this.ensureAvailable(bytes)
        this._dataview.setUint8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    async setUint16(value: number): Promise<void> {
        const bytes = 2
        await this.ensureAvailable(bytes)
        this._dataview.setUint16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async setUint32(value: number): Promise<void> {
        const bytes = 4
        await this.ensureAvailable(bytes)
        this._dataview.setUint32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    async trySetBytes(view: ArrayBufferView): Promise<number> {
        const bytes = view.byteLength
        const write = await this.tryEnsureAvailable(bytes)

        const dst = this._dataview.buffer
        const src = view.buffer
    
        const dstOffset = this._dataview.byteOffset + this._byteOffset
        const srcOffset = view.byteOffset

        copy(
            {
                buffer: src,
                byteOffset: srcOffset,
                byteLength: write,
            },
            {
                buffer: dst,
                byteOffset: dstOffset,
                byteLength: write,
            }
        )

        this._byteOffset += write
        return write
    }

    async setBytes(view: ArrayBufferView): Promise<void> {
        const written = await this.trySetBytes(view)
        if (written !== view.byteLength)
            throw new Error(`Not all bytes could be written (${view.byteLength} bytes requested, ${written} bytes written)`)
    }
}