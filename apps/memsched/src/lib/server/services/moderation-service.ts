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

interface ModerationResult {
  results: {
    flagged: boolean;
    categories?: Record<string, boolean>;
    category_scores?: Record<string, number>;
  }[];
}

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class ModerationService {
  private readonly retryOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
  };

  constructor() {}

  public isTextSafe(text: string) {
    return wrapResultAsyncFn(async () => {
      try {
        const res = await this.getModerationResult({ type: 'text', text: text });
        return !res.results[0].flagged;
      } catch (error) {
        console.error('Text moderation failed:', error);
        // Fallback: allow content when moderation service is unavailable
        // In production, you might want to be more conservative
        return true;
      }
    });
  }

  public isImageSafe(imageUrl: string) {
    return wrapResultAsyncFn(async () => {
      try {
        const res = await this.getModerationResult({
          type: 'image_url',
          image_url: { url: imageUrl },
        });
        return !res.results[0].flagged;
      } catch (error) {
        console.error('Image moderation failed:', error);
        // Fallback: allow content when moderation service is unavailable
        // In production, you might want to be more conservative
        return true;
      }
    });
  }

  private async getModerationResult(input: ModerationInput): Promise<ModerationResult> {
    return this.withRetry(async () => {
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
        if (res.status === 429) {
          // Rate limit exceeded - this will trigger a retry
          throw new Error(`Rate limit exceeded: ${res.statusText}`, { cause: 'RATE_LIMIT' });
        } else if (res.status >= 400 && res.status < 500) {
          // Client error - don't retry
          throw new Error(`Client error: ${res.status} ${res.statusText}`, {
            cause: 'CLIENT_ERROR',
          });
        } else {
          // Server error - retry
          throw new Error(`Server error: ${res.status} ${res.statusText}`, {
            cause: 'SERVER_ERROR',
          });
        }
      }

      const data = (await res.json()) as ModerationResult;
      return data;
    });
  }

  private async withRetry<T>(fn: () => Promise<T>, attempt: number = 1): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCause = error instanceof Error ? error.cause : null;

      // Don't retry client errors (except rate limits)
      if (errorCause === 'CLIENT_ERROR') {
        throw error;
      }

      if (attempt >= this.retryOptions.maxRetries) {
        console.error(`Moderation API failed after ${attempt} attempts:`, errorMessage);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        this.retryOptions.baseDelay * Math.pow(2, attempt - 1),
        this.retryOptions.maxDelay
      );

      console.warn(
        `Moderation API attempt ${attempt} failed: ${errorMessage}. Retrying in ${delay}ms...`
      );

      await this.sleep(delay);
      return this.withRetry(fn, attempt + 1);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
