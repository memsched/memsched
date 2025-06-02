/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
