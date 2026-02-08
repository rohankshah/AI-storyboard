import { Schema } from 'mongoose';
import mongoose from '../database/mongoose.js';

const ChunkSchema = new mongoose.Schema(
  {
    chunkIndex: Number,
    screenplay: {
      type: Schema.Types.ObjectId,
      ref: 'Screenplay',
      required: true,
    },
    originalText: String,
    status: {
      type: String,
      enum: ['UNPROCESSED', 'PROCESSED'],
      default: 'UNPROCESSED',
      required: true,
    }
  },
  { timestamps: true },
);

export const ChunkModel = mongoose.model('Chunk', ChunkSchema);
