import { describe, it } from "mocha";
import { DataViewByteReader } from "./reader.js"
import { DataViewByteWriter } from "./writer.js"
import { assert } from "chai";

describe("DataViewByteReader", () => {
    it("should read data written", () => {
        const data = [5522, 12.5, 0, 100]

        const buffer = new ArrayBuffer(4 * data.length)
        const float32 = new Float32Array(buffer)
        const reader = new DataViewByteReader(new DataView(buffer), true)

        for (let i = 0; i < data.length; i++)
            float32[i] = data[i]
        
        for (let i = 0; i < data.length; i++) {
            const read = reader.readFloat32()
            assert.equal(read, data[i])
        }
    })

    it("should read uint32's into twice as many uint16's (little endian)", () => {
        const uint32s = [0x12345678, 0xABCD8765]
        const uint16s = [0x5678, 0x1234, 0x8765, 0xABCD]
        const littleEndian = true

        const buffer = new ArrayBuffer(4 * uint32s.length)
        
        const writer = new DataViewByteWriter(new DataView(buffer), littleEndian)
        for (let i = 0; i < uint32s.length; i++)
            writer.writeUint32(uint32s[i])

        const reader = new DataViewByteReader(new DataView(buffer), littleEndian)
        for (let i = 0; i < uint16s.length; i++) {
            const read = reader.readUint16()
            assert.equal(read, uint16s[i])
        }
    })

    it("should read uint32's into twice as many uint16's (big endian)", () => {
        const uint32s = [0x12345678, 0xABCD8765]
        const uint16s = [0x1234, 0x5678, 0xABCD, 0x8765]
        const littleEndian = false

        const buffer = new ArrayBuffer(4 * uint32s.length)
        
        const writer = new DataViewByteWriter(new DataView(buffer), littleEndian)
        for (let i = 0; i < uint32s.length; i++)
            writer.writeUint32(uint32s[i])

        const reader = new DataViewByteReader(new DataView(buffer), littleEndian)
        for (let i = 0; i < uint16s.length; i++) {
            const read = reader.readUint16()
            assert.equal(read, uint16s[i])
        }
    })
})