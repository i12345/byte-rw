import { describe, it } from "mocha";
import { DataViewByteWriterDynamic } from "./writer-dynamic.js"
import { assert } from "chai";
import { DataViewByteReader } from "./reader.js";

describe("DataViewByteReader", () => {
    it("should read data written", () => {
        const data = new Uint16Array(16 * 1024)
        const littleEndian = true
        
        for (let i = 0; i < data.length; i++)
            data[i] = (i * 29) & 0xFFFF

        // const buffer = new ArrayBuffer(4 * data.length)
        // const float32 = new Float32Array(buffer)
        const writer = new DataViewByteWriterDynamic(littleEndian, 4096)
        for (let i = 0; i < data.length; i++)
            writer.setUint16(data[i])
        
        const reader = new DataViewByteReader(writer.dataview, littleEndian)
        for (let i = 0; i < data.length; i++) {
            const read = reader.getUint16()
            assert.equal(read, data[i])
        }
    })
})