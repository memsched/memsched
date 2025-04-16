import { env } from '$env/dynamic/private';

import { wrapResultAsyncFn } from '../db/types';

type ModerationInput =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export class ModerationService {
  constructor() {}

  public isTextSafe(text: string) {
    return wrapResultAsyncFn(async () => {
      const res = await this.getModerationResult({ type: 'text', text: text });
      return !res.results[0].flagged;
    });
  }

  public isImageSafe(imageUrl: string) {
    return wrapResultAsyncFn(async () => {
      const res = await this.getModerationResult({
        type: 'image_url',
        image_url: { url: imageUrl },
      });
      return !res.results[0].flagged;
    });
  }

  private async getModerationResult(input: ModerationInput) {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: [input],
      }),
    });

    if (!res.ok) {
      throw new Error(`Moderation API failed: ${res.statusText}`);
    }

    const data = (await res.json()) as {
      results: {
        flagged: boolean;
      }[];
    };

    return data;
  }
}
