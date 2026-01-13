import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PdfService } from './pdf/pdf.service.js';
import { PdfController } from './pdf/pdf.controller.js';
import { createPdfRouter } from './pdf/pdf.routes.js';
import { LlmService } from './llm/llm.service.js';

const app = express();

app.use(cors());

const llmService = new LlmService()
// await llmService.chat()

const pdfService = new PdfService(llmService);
const pdfController = new PdfController(pdfService);

app.use('/pdf', createPdfRouter(pdfController));

export default app;
