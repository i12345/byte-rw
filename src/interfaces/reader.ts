export interface ByteReader {
    /**
     * Whether all underlying data has been read or not
     */
    isComplete(): boolean

    /**
     * If false, a big-endian value should be read.
     * 
     * @default true
     */
    littleEndian: boolean

    /**
     * Gets the next Float32 value
     */
    readFloat32(): number

    /**
     * Gets the next Float64 value
     */
    readFloat64(): number

    /**
     * Gets the next Int8 value
     */
    readInt8(): number

    /**
     * Gets the next Int16 value
     */
    readInt16(): number

    /**
     * Gets the next Int32 value
     */
    readInt32(): number

    /**
     * Gets the next Uint8 value
     */
    readUint8(): number

    /**
     * Gets the next Uint16 value
     */
    readUint16(): number

    /**
     * Gets the next Uint32 value
     */
    readUint32(): number

    /**
     * Attempts to read into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @returns the number of bytes that were actually read
     */
    tryReadBytes(view: ArrayBufferView): number

    /**
     * Reads into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @throws error if the number of bytes requested could not be read
     */
    readBytes(view: ArrayBufferView): void

    /**
     * Gets the next string using a prefix length
     */
    getString(): string
}