export interface DataViewChunk {
    buffer: ArrayBuffer
    bytesWritten: number
}

export interface DataViewChunkedWorker {
    minChunkSize: number
}