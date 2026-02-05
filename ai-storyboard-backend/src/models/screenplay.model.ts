import mongoose from '../database/mongoose.js';

const ScreenplaySchema = new mongoose.Schema(
  {
    screenplayId: String,
    name: String,
  },
  { timestamps: true },
);

export const ScreenplayModel = mongoose.model('Screenplay', ScreenplaySchema);
