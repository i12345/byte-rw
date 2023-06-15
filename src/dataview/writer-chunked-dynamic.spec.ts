import { describe, it } from "mocha";
import { DataViewByteWriterChunkedDynamic } from "./writer-chunked-dynamic.js"
import { assert } from "chai";
import { DataViewByteReader } from "./reader.js";

describe("DataViewByteWriterChunkedDynamic", () => {
    it("should combine writing", () => {
        const data = new Uint16Array(11 * 1024)
        const littleEndian = true
        
        for (let i = 0; i < data.length; i++)
            data[i] = (i * 29) & 0xFFFF
        
        const writer = new DataViewByteWriterChunkedDynamic(littleEndian, 4096)
        for (let i = 0; i < data.length; i++)
            writer.setUint16(data[i])
        
        const combined = writer.combineChunks()
        const reader = new DataViewByteReader(new DataView(combined), littleEndian)
        for (let i = 0; i < data.length; i++) {
            const read = reader.getUint16()
            if (read !== data[i])
                console.log('!=')
            assert.equal(read, data[i])
        }
    })
})