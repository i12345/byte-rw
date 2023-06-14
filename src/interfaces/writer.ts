export interface ByteWriter {
    /**
     * If false, a big-endian value should be written.
     * 
     * @default true
     */
    littleEndian: boolean

    /**
     * Stores an Float32 value.
     * @param value The value to set.
     */
    setFloat32(value: number): void;

    /**
     * Stores an Float64 value.
     * @param value The value to set.
     */
    setFloat64(value: number): void;

    /**
     * Stores an Int8 value.
     * @param value The value to set.
     */
    setInt8(value: number): void;

    /**
     * Stores an Int16 value.
     * @param value The value to set.
     */
    setInt16(value: number): void;

    /**
     * Stores an Int32 value.
     * @param value The value to set.
     */
    setInt32(value: number): void;

    /**
     * Stores an Uint8 value.
     * @param value The value to set.
     */
    setUint8(value: number): void;

    /**
     * Stores an Uint16 value.
     * @param value The value to set.
     */
    setUint16(value: number): void;

    /**
     * Stores an Uint32 value.
     * @param value The value to set.
     */
    setUint32(value: number): void;

    /**
     * Writes from the given {@link ArrayBufferView}.
     *
     * @param buffer the buffer to write from
     */
    setBytes(buffer: ArrayBufferView): void
}