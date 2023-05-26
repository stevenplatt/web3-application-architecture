import { Noise } from './noise.js';
export * from './crypto.js';
export * from './crypto/stablelib.js';
export function noise(init = {}) {
    return () => new Noise(init);
}
//# sourceMappingURL=index.js.map