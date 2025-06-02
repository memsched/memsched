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
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import {
  CloudflareIPRateLimiter,
  CloudflareIPUARateLimiter,
} from 'sveltekit-rate-limiter/server/limiters';

// Rate limiter for regular auth attempts (less strict)
export const authLimiter = new RateLimiter({
  IP: [30, 'm'], // 30 requests per minute
  IPUA: [20, 'm'], // 20 requests per minute based on IP + User Agent
  plugins: import.meta.env.PROD
    ? [
        new CloudflareIPRateLimiter(
          [30, 'm'] // 30 requests per minute
        ),
        new CloudflareIPUARateLimiter(
          [20, 'm'] // 20 requests per minute
        ),
      ]
    : [],
});

// Stricter rate limiter for login attempts (to prevent brute forcing)
export const loginLimiter = new RateLimiter({
  IP: [10, 'm'], // 10 requests per minute
  IPUA: [5, 'm'], // 5 requests per minute based on IP + User Agent
  plugins: import.meta.env.PROD
    ? [
        new CloudflareIPRateLimiter(
          [10, 'm'] // 10 requests per minute
        ),
        new CloudflareIPUARateLimiter(
          [5, 'm'] // 5 requests per minute
        ),
      ]
    : [],
});

// For OAuth callback protection
export const oauthLimiter = new RateLimiter({
  IP: [15, 'm'], // 15 requests per minute
  IPUA: [10, 'm'], // 10 requests per minute based on IP + User Agent
  plugins: import.meta.env.PROD
    ? [
        new CloudflareIPRateLimiter(
          [15, 'm'] // 15 requests per minute
        ),
        new CloudflareIPUARateLimiter(
          [10, 'm'] // 10 requests per minute
        ),
      ]
    : [],
});

// Image upload rate limiter
export const imageUploadLimiter = new RateLimiter({
  IP: [30, 'm'], // 30 requests per minute
  IPUA: [20, 'm'], // 20 requests per minute based on IP + User Agent
  plugins: import.meta.env.PROD
    ? [
        new CloudflareIPRateLimiter(
          [30, 'm'] // 30 requests per minute
        ),
        new CloudflareIPUARateLimiter(
          [20, 'm'] // 20 requests per minute
        ),
      ]
    : [],
});
