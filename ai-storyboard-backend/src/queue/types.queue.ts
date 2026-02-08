import { Types } from "mongoose";

export interface SummarizeQueueJob {
  totalChunks: number;
  chunkId: Types.ObjectId
}