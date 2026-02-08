import { Request, Response, NextFunction } from 'express';
import { PdfService } from './pdf.service.js';
import { createSHA256Hash } from '../utils/helpers.js';
import { ScreenplayModel } from '../models/screenplay.model.js';

export class PdfController {
  constructor(private pdfService: PdfService) {}

  handleUploadedFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF uploaded' });
      }

      const screenplayFile = req.file;

      // Calculate sha256 of pdf raw bytes.
      const pdfRawBytes = screenplayFile.buffer;
      const screenplayHash = createSHA256Hash(pdfRawBytes);

      const exists = await ScreenplayModel.find({
        screenplayId: screenplayHash,
      });

      // If doesn't exist then save
      if (exists && exists.length === 0) {
        this.pdfService.handleInitialSave(screenplayFile, screenplayHash);
      } else {
        // If exists then check if any chunks haven't been proceesed. And add them to queue
        // this.pdfService.processChunks()
      }

      res.status(200).json({ message: 'success' });
    } catch (err) {
      next(err);
    }
  };
}
