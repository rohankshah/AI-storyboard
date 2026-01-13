import { Request, Response, NextFunction } from 'express';
import { PdfService } from './pdf.service.js';

export class PdfController {
  constructor(private pdfService: PdfService) {}

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
