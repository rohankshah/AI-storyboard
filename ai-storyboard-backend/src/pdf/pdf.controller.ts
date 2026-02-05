import { Request, Response, NextFunction } from 'express';
import { PdfService } from './pdf.service.js';
import { createSHA256Hash } from '../utils/helpers.js';
import { ScreenplayModel } from '../models/screenplay.model.js';
import { ChunkModel } from '../models/chunk.model.js';
import { HydratedDocument } from 'mongoose';

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

      // Calculate sha256 of pdf raw bytes.
      const screenplayName = req.file.originalname;
      const pdfRawBytes = req.file.buffer;
      const screenplayHash = createSHA256Hash(pdfRawBytes);

      const exists = await ScreenplayModel.find({
        screenplayId: screenplayHash,
      });
      console.log('exists', exists);

      // If doesn't exist then save
      if (exists && exists.length === 0) {
        const screenplayModel = new ScreenplayModel({ screenplayId: screenplayHash, name: screenplayName })
        await screenplayModel.save()

        // Extract chunks
        const text = await this.pdfService.handlePdfParse(req.file);

        const chunks = this.pdfService.convertTextToChunks(text);
        const totalChunks = chunks.length;

        // Save chunks
        for (let i = 0; i < totalChunks; i++) {
          let chunk = chunks[i];

          const chunkModel = new ChunkModel({
            index: i,
            screenplay: screenplayModel,
            original: chunk
          })
          await chunkModel.save()
        }
      }

      res.status(200).json({ message: 'success' });
    } catch (err) {
      next(err);
    }
  };

  parsePdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF uploaded' });
      }

      this.pdfService.handleSummarize(req.file);

      res.status(200).json({ message: 'success' });
    } catch (err) {
      next(err);
    }
  };
}
