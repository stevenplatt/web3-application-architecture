import type { ConnectionEncrypter } from '@libp2p/interface-connection-encrypter';
import type { NoiseInit } from './noise.js';
import type { NoiseExtensions } from './proto/payload.js';
export * from './crypto.js';
export * from './crypto/stablelib.js';
export declare function noise(init?: NoiseInit): () => ConnectionEncrypter<NoiseExtensions>;
//# sourceMappingURL=index.d.ts.map