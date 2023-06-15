export interface DataViewChunk {
    view: ArrayBufferView
    bytesWritten: number
}

export interface DataViewChunkedWorker {
    defaultChunkSize: number
}