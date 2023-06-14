import { describe, it } from "mocha"
import { StreamByteReader } from "./reader.js"

describe("StreamByteReader", () => {
    it("should read data", async () => {
        // const buffer = new ReadableStream
        const response = await fetch("https://developer.mozilla.org/en-US/docs/Web/API/fetch")
        const reader = new StreamByteReader(response.body!)
        const chars = new Uint8Array(256)
        await reader.getBytes(chars)
        const decoded = new TextDecoder().decode(chars)
        console.log(decoded)
    })
})