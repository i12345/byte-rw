import { describe, it } from "mocha";
import { assert } from "chai";
import { DataViewByteReader } from "./reader.js";
import { DataViewByteWriter } from "./writer.js";

describe("DataViewByteWriter", () => {
    it("should read and write strings", () => {
        const data = new DataView(new ArrayBuffer(1024))
        const writer = new DataViewByteWriter(data)
        const reader = new DataViewByteReader(data)

        const written = "Hello world!"
        writer.setString(written)
        
        const read = reader.getString()
        assert.equal(written, read)
    })
})