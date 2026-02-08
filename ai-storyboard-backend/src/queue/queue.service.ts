import { llmQueue } from './pdf.queue.js';
import { SummarizeQueueJob } from './types.queue.js';

export class QueueService {
  constructor() {}

  async addToSummarizeQueue(job: SummarizeQueueJob) {
    llmQueue.add('summarize', job);
  }
}
