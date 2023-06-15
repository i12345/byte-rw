# byte-rw

Reading and writing at the byte level is easy with `byte-rw`. It exposes two interfaces like the [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) object but is adaptable for streams or other implementations.

```typescript
const littleEndian = true

const writer_inMemory = new DataViewByteWriterChunkedDynamic(littleEndian)
writeData(writer_inMemory)
const data = writer_inMemory.combineChunks() // ArrayBuffer
console.log(data)

const stream: WritableStream = ...
const writer_stream = new StreamByteWriter(stream)
writeData(writer_stream)

function writeData(writer: ByteWriter) {
    const endianness = writer.littleEndian
    writer.setUint16(0xABCD)
    writer.setUint16(0x1234)

    writer.littleEndian = false
    writer.setUint32(0xCC0011FF)

    writer.littleEndian = endianness
}
```

See also the [ByteBuffer](https://www.npmjs.com/package/bytebuffer) for another buffer interface. It must have well more performance and is more mature though appears limited to working with in-memory buffers; this package may have more flexibility and can work with streams.

## Appreciation

Mocha + typescript + ES modules: [Henry Ruhs](https://stackoverflow.com/a/69730199)

Function annotations largely adapted from type declarations in lib.es5.d.ts.
