import { DataViewByteReader } from "../src/index.js";

const dataviewA = new DataView(new ArrayBuffer(16))

const dataviewA_float32 = new Float32Array(dataviewA.buffer)
dataviewA_float32[0] = 23
dataviewA_float32[1] = 7
dataviewA_float32[2] = 21
dataviewA_float32[3] = 34

const reader = new DataViewByteReader(dataviewA, true)
console.assert(23 == reader.getFloat32())
console.assert(7 == reader.getFloat32())
console.assert(21 == reader.getFloat32())
console.assert(34 == reader.getFloat32())
console.log("OK")