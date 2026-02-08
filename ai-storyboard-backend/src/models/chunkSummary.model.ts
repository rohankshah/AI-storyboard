import mongoose from '../database/mongoose.js';

const ChunkSummary = new mongoose.Schema(
  {
    model: String,
    index: Number,
    start: String,
    end: String,
    continuedFromPrevious: Boolean,
    continuesInNext: Boolean,
    summary: String,
    isLatest: Boolean,
  },
  { timestamps: true },
);

export const ChunkSummaryModel = mongoose.model('ChunkSummary', ChunkSummary);
