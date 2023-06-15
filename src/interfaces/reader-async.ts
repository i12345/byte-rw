export interface ByteReaderAsync {
    /**
     * Whether all underlying data has been read or not
     */
    isComplete(): Promise<boolean>

    /**
     * If false, a big-endian value should be read.
     * 
     * @default true
     */
    littleEndian: boolean

    /**
     * Gets the next Float32 value
     */
    readFloat32(): Promise<number>

    /**
     * Gets the next Float64 value
     */
    readFloat64(): Promise<number>

    /**
     * Gets the next Int8 value
     */
    readInt8(): Promise<number>

    /**
     * Gets the next Int16 value
     */
    readInt16(): Promise<number>

    /**
     * Gets the next Int32 value
     */
    readInt32(): Promise<number>

    /**
     * Gets the next Uint8 value
     */
    readUint8(): Promise<number>

    /**
     * Gets the next Uint16 value
     */
    readUint16(): Promise<number>

    /**
     * Gets the next Uint32 value
     */
    readUint32(): Promise<number>

    /**
     * Attempts to read into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @returns the number of bytes that were actually read
     */
    tryReadBytes(view: ArrayBufferView): Promise<number>

    /**
     * Reads into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @throws error if the number of bytes requested could not be read
     */
    readBytes(view: ArrayBufferView): Promise<void>

    /**
     * Gets the next string using a prefix length
     */
    readString(): Promise<string>
}