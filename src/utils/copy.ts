export function copy(
    src: ArrayBufferView,
    dst: ArrayBufferView
) {
    // Thanks for technique shown by stack overflow user Gleno
    // https://stackoverflow.com/a/22114687

    console.assert(src.byteLength === dst.byteLength)

    const dst_u8 = new Uint8Array(dst.buffer, dst.byteOffset, dst.byteLength)
    const src_u8 = new Uint8Array(src.buffer, src.byteOffset, src.byteLength)

    dst_u8.set(src_u8)
}