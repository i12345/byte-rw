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
    getFloat32(): number

    /**
     * Gets the next Float64 value
     */
    getFloat64(): number

    /**
     * Gets the next Int8 value
     */
    getInt8(): number

    /**
     * Gets the next Int16 value
     */
    getInt16(): number

    /**
     * Gets the next Int32 value
     */
    getInt32(): number

    /**
     * Gets the next Uint8 value
     */
    getUint8(): number

    /**
     * Gets the next Uint16 value
     */
    getUint16(): number

    /**
     * Gets the next Uint32 value
     */
    getUint32(): number

    /**
     * Attempts to read into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @returns the number of bytes that were actually read
     */
    tryGetBytes(view: ArrayBufferView): number

    /**
     * Reads into the given {@link ArrayBufferView}.
     *
     * @param view the view to read into
     * @throws error if the number of bytes requested could not be read
     */
    getBytes(view: ArrayBufferView): void
}