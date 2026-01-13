import { PDFParse } from 'pdf-parse';
import { LlmService } from '../llm/llm.service.js';

export class PdfService {
  constructor(private llmService: LlmService) {}

  async handleSummarize(file: Express.Multer.File) {
    const text = await this.handlePdfParse(file);

    const chunks = this.convertTextToChunks(text);
    const totalChunks = chunks.length;

    let previousChunk: string | null = null;

    const summary = [];

    // console.log('AI summarizing')
    for (let i = 0; i < 2; i++) {
      let chunk = chunks[i];

      const data = await this.llmService.chat(
        chunk,
        previousChunk,
        i,
        totalChunks,
      );

      summary.push(data?.choices[0].message.content);

      previousChunk = chunk;
    }

    console.log(summary);
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
