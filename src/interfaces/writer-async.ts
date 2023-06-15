export interface ByteWriterAsync {
    /**
     * Whether all underlying data has been written or not
     */
    isComplete(): Promise<boolean>

    /**
     * Marks this writer as complete and informs the underlying sink if needed
     */
    complete(): Promise<void>

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
    setFloat32(value: number): Promise<void>;

    /**
     * Stores an Float64 value.
     * @param value The value to set.
     */
    setFloat64(value: number): Promise<void>;

    /**
     * Stores an Int8 value.
     * @param value The value to set.
     */
    setInt8(value: number): Promise<void>;

    /**
     * Stores an Int16 value.
     * @param value The value to set.
     */
    setInt16(value: number): Promise<void>;

    /**
     * Stores an Int32 value.
     * @param value The value to set.
     */
    setInt32(value: number): Promise<void>;

    /**
     * Stores an Uint8 value.
     * @param value The value to set.
     */
    setUint8(value: number): Promise<void>;

    /**
     * Stores an Uint16 value.
     * @param value The value to set.
     */
    setUint16(value: number): Promise<void>;

    /**
     * Stores an Uint32 value.
     * @param value The value to set.
     */
    setUint32(value: number): Promise<void>;

    /**
     * Attempts to write from the given {@link ArrayBufferView}.
     *
     * @param view the view to write from
     * @returns the number of bytes that were actually written
     */
    trySetBytes(view: ArrayBufferView): Promise<number>

    /**
     * Writes from the given {@link ArrayBufferView}.
     *
     * @param view the view to write from
     * @throws error if the bytes for the view could not be written
     */
    setBytes(view: ArrayBufferView): Promise<void>
}