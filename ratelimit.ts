import { createMutex } from "@117/mutex";

/**
 * RateLimit class to limit the execution of a callback function
 * to a specified rate in milliseconds.
 *
 * Usage:
 * const rateLimiter = new RateLimit(1000); // 1 second rate limit
 * await rateLimiter.limit(() => {
 *   // Your code here
 * });
 */
export class RateLimit {
  /** The next available time to execute the callback */
  private available: Date = new Date();
  /** Mutex to ensure that only one callback is executed at a time */
  private mutex = createMutex();

  /** rate is number of milliseconds since start of previous call */
  constructor(private readonly rate: number) {}

  /** What for a period of time */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Call the callback with rate limiting */
  public async limit<T>(callback: () => T): Promise<T> {
    await this.mutex.acquire();
    let result: T;

    try {
      // How many ms until timeout
      const now: Date = new Date();
      const wait: number = this.available.getTime() - now.getTime();
      if (wait > 0) await this.delay(wait);

      // Next time to run
      const next = this.available.getTime() + this.rate;
      this.available = new Date(next);

      // Executing callback and return result
      result = callback();
    } finally {
      this.mutex.release();
    }
    return result;
  }
}
