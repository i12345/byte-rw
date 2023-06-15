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
    writeFloat32(value: number): Promise<void>;

    /**
     * Stores an Float64 value.
     * @param value The value to set.
     */
    writeFloat64(value: number): Promise<void>;

    /**
     * Stores an Int8 value.
     * @param value The value to set.
     */
    writeInt8(value: number): Promise<void>;

    /**
     * Stores an Int16 value.
     * @param value The value to set.
     */
    writeInt16(value: number): Promise<void>;

    /**
     * Stores an Int32 value.
     * @param value The value to set.
     */
    writeInt32(value: number): Promise<void>;

    /**
     * Stores an Uint8 value.
     * @param value The value to set.
     */
    writeUint8(value: number): Promise<void>;

    /**
     * Stores an Uint16 value.
     * @param value The value to set.
     */
    writeUint16(value: number): Promise<void>;

    /**
     * Stores an Uint32 value.
     * @param value The value to set.
     */
    writeUint32(value: number): Promise<void>;

    /**
     * Attempts to write from the given {@link ArrayBufferView}.
     *
     * @param view the view to write from
     * @returns the number of bytes that were actually written
     */
    tryWriteBytes(view: ArrayBufferView): Promise<number>

    /**
     * Writes from the given {@link ArrayBufferView}.
     *
     * @param view the view to write from
     * @throws error if the bytes for the view could not be written
     */
    writeBytes(view: ArrayBufferView): Promise<void>

    /**
     * Stores a string using a prefix length
     * @param value the value to set
     */
    writeString(value: string): Promise<void>
}