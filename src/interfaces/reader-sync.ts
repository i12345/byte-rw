export interface ByteReader {
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
     * Reads into the given {@link ArrayBufferView}.
     *
     * @param buffer the buffer to read into
     */
    getBytes(buffer: ArrayBufferView): void
}