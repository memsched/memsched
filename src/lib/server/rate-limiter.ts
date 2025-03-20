import { RateLimiter } from 'sveltekit-rate-limiter/server';
import {
  CloudflareIPUARateLimiter,
  CloudflareIPRateLimiter,
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
