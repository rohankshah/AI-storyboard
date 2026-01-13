import { JSONSchemaConfig } from '@openrouter/sdk/models';

export const sceneSchema: JSONSchemaConfig = {
  name: 'scene_split',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      sceneId: {
        type: 'string',
        description: 'Scene id',
      },
      start: {
        type: 'string',
        description: 'Opening visual or key action starting the scen',
      },
      end: {
        type: 'string',
        description: 'Closing visual or key action ending the scene',
      },
      continuedFromPrevious: {
        type: 'boolean',
        description: 'True if the scene began before this text chunk',
      },
      continuesInNext: {
        type: 'boolean',
        description: 'True if the scene continues beyond this text chunk',
      },
      summary: {
        type: 'string',
        description: '1–2 sentences describing what would be shown visually on screen',
      },
    },
    required: [
      'sceneId',
      'start',
      'end',
      'continuedFromPrevious',
      'continuesInNext',
      'summary',
    ],
    additionalProperties: false,
  },
};
