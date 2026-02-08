import { Worker } from 'bullmq';
import { connection } from './pdf.queue.js';
import { LlmService } from '../llm/llm.service.js';
import { SummarizeQueueJob } from './types.queue.js';
import { ChunkModel } from '../models/chunk.model.js';
import { ChunkSummaryModel } from '../models/chunkSummary.model.js';

export const createSummarizeWorker = (llmService: LlmService) => {
  const worker = new Worker(
    'summarize',
    async (job) => {
      const { totalChunks, chunkId } = job.data as SummarizeQueueJob;

      const chunkItem = await ChunkModel.findOne({ _id: chunkId });
      const chunkIndex = chunkItem?.get('chunkIndex');
      const originalChunk = chunkItem?.get('originalText');

      if (typeof chunkIndex !== 'number' || !originalChunk) {
        return;
      }

      let previousChunk = '';
      if (chunkIndex > 0) {
        const previousChunkRaw = await ChunkModel.findOne({
          chunkIndex: chunkIndex - 1,
          screenplay: chunkItem?.get('screenplay'),
        });
        previousChunk = previousChunkRaw?.get('originalText') ?? '';
      }

      // LLM Generate summary
      const data = await llmService.chat(
        originalChunk,
        previousChunk,
        chunkIndex,
        totalChunks,
      );

      const chunkSummaryRaw = data?.choices[0].message.content as string;
      const chunkSummary = JSON.parse(chunkSummaryRaw);

      // Mark earlier chunkSummary items (isLatest: false)
      ChunkSummaryModel.updateMany(
        { chunkId, isLatest: true },
        { $set: { isLatest: true } },
      );

      // Create new chunk summary item
      const chunkSummaryItem = new ChunkSummaryModel({
        chunkIndex: chunkIndex,
        model: data?.model,
        start: chunkSummary?.start,
        end: chunkSummary?.end,
        continuedFromPrevious: chunkSummary?.continuedFromPrevious,
        continuesInNext: chunkSummary?.continuesInNext,
        summary: chunkSummary?.summary,
        isLatest: true,
      });

      await chunkSummaryItem.save();

      // Mark chunk as 'PROCESSED'
      chunkItem?.set('status', 'PROCESSED');

      await chunkItem?.save();
    },
    { connection },
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
  });

  return worker;
};
