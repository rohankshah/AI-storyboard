import { OpenRouter } from '@openrouter/sdk';
import { sceneSchema } from './llm.schemas.js';

export class LlmService {
  private router: OpenRouter;
  constructor() {
    this.router = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  async chat(chunk: string, previousChunk: string | null, index: number, totalChunks: number) {
    try {
      let completion = await this.router.chat.send({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'user',
            content: `
            You are extracting scenes for a visual storyboard.

            Rules:
            - A scene represents a continuous moment in time and place.
            - If this text continues a scene from earlier, mark continuedFromPrevious = true.
            - If the scene clearly continues beyond this text, mark continuesInNext = true.
            - Use concise, visual language suitable for storyboards.

            Previous scene summary:
            ${previousChunk ?? 'None'}

            Text:
            ${chunk}

            Chunk position:
            - Chunk ${index + 1} of ${totalChunks}
            - This chunk may start or end mid-scene.

            Return ONLY valid JSON matching the schema.
            `,
          },
        ],
        responseFormat: {
          type: 'json_schema',
          jsonSchema: sceneSchema,
        },
      });

      return(completion)

      // console.log(completion.choices[0].message);

      // console.log(completion.choices[0].message.content);
    } catch (err) {
      console.log(err);
    }
  }
}
