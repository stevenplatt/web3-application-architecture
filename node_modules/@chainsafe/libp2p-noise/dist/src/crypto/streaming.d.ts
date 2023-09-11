import type { Transform } from 'it-stream-types';
import type { Uint8ArrayList } from 'uint8arraylist';
import type { IHandshake } from '../@types/handshake-interface.js';
import type { MetricsRegistry } from '../metrics.js';
export declare function encryptStream(handshake: IHandshake, metrics?: MetricsRegistry): Transform<Uint8Array>;
export declare function decryptStream(handshake: IHandshake, metrics?: MetricsRegistry): Transform<Uint8ArrayList, Uint8Array>;
//# sourceMappingURL=streaming.d.ts.map