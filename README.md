# ratelimit

Ensure minimum amount of time between executing functions

## Examples

```typescript
import { RateLimit } from "jsr:@sauber/ratelimit";

// Callback function
const callback = function (): Promise<number> {
  return Promise.resolve(Math.random());
};

// 100 milliseconds
const rate = 100;
const rl = new RateLimit(rate);

const prom1 = rl.limit(callback);
const prom2 = rl.limit(callback);
const prom3 = rl.limit(callback);
// Running in random order at specified rate
await Promise.all([prom1, prom2, prom3]);
```
