import { Router } from 'express';
import { PdfController } from './pdf.controller.js';
import { upload } from '../middleware/upload.js';

export function createPdfRouter(pdfController: PdfController) {
  const router = Router();

  router.post('/', upload.single('pdf'), pdfController.parsePdf);

  return router;
}
