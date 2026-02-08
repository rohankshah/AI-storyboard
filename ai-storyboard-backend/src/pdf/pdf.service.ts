import { PDFParse } from 'pdf-parse';
import { QueueService } from '../queue/queue.service.js';
import { ScreenplayModel } from '../models/screenplay.model.js';
import { ChunkModel } from '../models/chunk.model.js';

type MulterFile = Express.Multer.File;

export class PdfService {
  constructor(
    private queueService: QueueService,
  ) {}

  async handleInitialSave(screenplayFile: MulterFile, screenplayHash: string) {
    const screenplayName = screenplayFile?.originalname;

    const screenplayModel = new ScreenplayModel({
      screenplayId: screenplayHash,
      name: screenplayName,
    });
    await screenplayModel.save();

    // Extract chunks
    const text = await this.handlePdfParse(screenplayFile);

    const chunks = this.convertTextToChunks(text);
    const totalChunks = chunks.length;

    // Save chunks
    for (let i = 0; i < 1; i++) {
      let chunk = chunks[i];

      const chunkModel = new ChunkModel({
        index: i,
        screenplay: screenplayModel,
        original: chunk,
        status: 'UNPROCESSED',
      });

      await chunkModel.save();

      this.queueService.addToSummarizeQueue({
        totalChunks: totalChunks,
        chunkId: chunkModel._id
      });
    }
  }

  async handlePdfParse(pdfFile: Express.Multer.File) {
    // const filename = pdfFile?.originalname;
    const fileUrl = pdfFile?.buffer;

    const parser = new PDFParse({ data: fileUrl });
    const result = await parser.getText();

    const totalPages = result?.total;

    let pageText = '';

    for (let i = 0; i < totalPages; i++) {
      const currPageText = result?.getPageText(i);
      pageText += currPageText?.trim();
    }

    await parser.destroy();

    return pageText;
  }

  // Todo: Add overlap
  convertTextToChunks(text: string) {
    const chunkSize = 1350;
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    return chunks;
  }
}
