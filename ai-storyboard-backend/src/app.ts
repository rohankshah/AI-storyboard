import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PdfService } from './pdf/pdf.service.js';
import { PdfController } from './pdf/pdf.controller.js';
import { createPdfRouter } from './pdf/pdf.routes.js';
import { LlmService } from './llm/llm.service.js';
import { connectMongo } from './database/mongoose.js';
import { QueueService } from './queue/queue.service.js';
import { createSummarizeWorker } from './queue/pdf.worker.js';

const app = express();

app.use(cors());

// Connect db service
await connectMongo();

const llmService = new LlmService();

createSummarizeWorker(llmService);

const queueService = new QueueService();

const pdfService = new PdfService(queueService);
const pdfController = new PdfController(pdfService);

app.use('/pdf', createPdfRouter(pdfController));

export default app;
