import { ByteReader } from "../interfaces/index.js"
import { copy, textDecoder } from "../utils/index.js"

export class DataViewByteReader implements ByteReader {
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

    isComplete(): boolean {
        return this._isComplete ||= this.updateIsComplete()
    }

    constructor(
        dataview: DataView,
        public littleEndian = true
    ) { 
        this._dataview = dataview
    }

    protected updateIsComplete(): boolean {
        return this.tryEnsureAvailable(1) > 0
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
    protected tryEnsureAvailable(bytes: number): number {
        if (this._bytesRemaining < bytes)
            return this._bytesRemaining
        else
            return bytes
    }

    protected ensureAvailable(bytes: number): void {
        const available = this.tryEnsureAvailable(bytes)

        if (available !== bytes)
            throw new Error(`Not all bytes could be available (${bytes} bytes requested, ${available} bytes available)`)
    }

    /**
     * Gets the next Float32 value
     */
    readFloat32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getFloat32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Float64 value
     */
    readFloat64(): number {
        const bytes = 8
        this.ensureAvailable(bytes)
        const value = this._dataview.getFloat64(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int8 value
     */
    readInt8(): number {
        const bytes = 1
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int16 value
     */
    readInt16(): number {
        const bytes = 2
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Int32 value
     */
    readInt32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getInt32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint8 value
     */
    readUint8(): number {
        const bytes = 1
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint8(this._byteOffset)
        this._byteOffset += bytes
        return value
    }
    
    /**
     * Gets the next Uint16 value
     */
    readUint16(): number {
        const bytes = 2
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint16(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    /**
     * Gets the next Uint32 value
     */
    readUint32(): number {
        const bytes = 4
        this.ensureAvailable(bytes)
        const value = this._dataview.getUint32(this._byteOffset, this.littleEndian)
        this._byteOffset += bytes
        return value
    }

    tryReadBytes(view: ArrayBufferView): number {
        const bytes = view.byteLength
        const read = this.tryEnsureAvailable(bytes)

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

        this._byteOffset += read
        return read
    }

    readBytes(view: ArrayBufferView): void {
        const read = this.tryReadBytes(view)
        if (read !== view.byteLength)
            throw new Error(`Not all bytes could be read (${view.byteLength} bytes request, ${read} bytes read)`)
    }

    readString(): string {
        const length = this.readUint32()

        this.ensureAvailable(length)
        
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