import { ByteWriter } from "../interfaces/writer.js";
import { copy, textEncoder } from "../utils/index.js";

export class DataViewByteWriter implements ByteWriter {
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

    complete(): void {
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
    protected tryEnsureAvailable(bytes: number): number {
        if (this._isComplete)
            return 0
        
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

    writeFloat32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setFloat32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    writeFloat64(value: number): void {
        const bytes = 8
        this.ensureAvailable(bytes)
        this._dataview.setFloat64(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    writeInt8(value: number): void {
        const bytes = 1
        this.ensureAvailable(bytes)
        this._dataview.setInt8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    writeInt16(value: number): void {
        const bytes = 2
        this.ensureAvailable(bytes)
        this._dataview.setInt16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    writeInt32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setInt32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    writeUint8(value: number): void {
        const bytes = 1
        this.ensureAvailable(bytes)
        this._dataview.setUint8(this._byteOffset, value)
        this._byteOffset += bytes
    }

    writeUint16(value: number): void {
        const bytes = 2
        this.ensureAvailable(bytes)
        this._dataview.setUint16(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    writeUint32(value: number): void {
        const bytes = 4
        this.ensureAvailable(bytes)
        this._dataview.setUint32(this._byteOffset, value, this.littleEndian)
        this._byteOffset += bytes
    }

    tryWriteBytes(view: ArrayBufferView): number {
        const bytes = view.byteLength
        const write = this.tryEnsureAvailable(bytes)

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

    writeBytes(view: ArrayBufferView): void {
        const written = this.tryWriteBytes(view)
        if (written !== view.byteLength)
            throw new Error(`Not all bytes could be written (${view.byteLength} bytes requested, ${written} bytes written)`)
    }

    setString(value: string): void {
        const encoded = textEncoder.encode(value)
        this.writeUint32(encoded.byteLength)
        this.writeBytes(encoded)
    }
}