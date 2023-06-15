import { describe, it } from "mocha"
import { StreamByteReader } from "./reader.js"
import { assert } from "chai"

describe("StreamByteReader", () => {
    it("should read data", async () => {
        const longStr = new Array<string>(12).fill("a").join("") + "🎳🐋🐆:)"
        const response = await fetch("data:," + longStr)
        const reader = new StreamByteReader(response.body!)
        const chars = new Uint8Array(8)
        
        let read = ""
        let readBytes: number
        do {
            readBytes = await reader.tryReadBytes(chars)
            const decoded = new TextDecoder().decode(chars.slice(0, readBytes))
            read += decoded
            // console.log(`${read} bytes / ${decoded.length} chars:`)
            // console.log(decoded)
        } while (readBytes == chars.length)
        
        assert.equal(longStr, read)
    })
})