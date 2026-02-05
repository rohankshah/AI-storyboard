import { Schema } from 'mongoose';
import mongoose from '../database/mongoose.js';

const ChunkSchema = new mongoose.Schema(
  {
    index: Number,
    screenplay: {
      type: Schema.Types.ObjectId,
      ref: 'Screenplay',
      required: true,
    },
    original: String,
    summary: String
  },
  { timestamps: true },
);

export const ChunkModel = mongoose.model('Chunk', ChunkSchema);
