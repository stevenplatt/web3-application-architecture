import { Field, Bool, Group, Scalar } from './core.js';
import { CircuitValue, AnyConstructor } from './circuit_value.js';
import { PrivateKey as PrivateKeyBigint } from '../provable/curve-bigint.js';
export { PrivateKey, PublicKey, Signature };
export { scaleShifted };
/**
 * A signing key. You can generate one via {@link PrivateKey.random}.
 */
declare class PrivateKey extends CircuitValue {
    s: Scalar;
    constructor(s: Scalar);
    /**
     * You can use this method to generate a private key. You can then obtain
     * the associated public key via {@link toPublicKey}. And generate signatures
     * via {@link Signature.create}.
     *
     * @returns a new {@link PrivateKey}.
     */
    static random(): PrivateKey;
    /**
     * Deserializes a list of bits into a {@link PrivateKey}.
     *
     * @param bs a list of {@link Bool}.
     * @returns a {@link PrivateKey}.
     */
    static fromBits(bs: Bool[]): PrivateKey;
    /**
     * Convert this {@link PrivateKey} to a bigint
     */
    toBigInt(): bigint;
    /**
     * Create a {@link PrivateKey} from a bigint
     *
     * **Warning**: Private keys should be sampled from secure randomness with sufficient entropy.
     * Be careful that you don't use this method to create private keys that were sampled insecurely.
     */
    static fromBigInt(sk: PrivateKeyBigint): PrivateKey;
    /**
     * Derives the associated public key.
     *
     * @returns a {@link PublicKey}.
     */
    toPublicKey(): PublicKey;
    /**
     * Decodes a base58 string into a {@link PrivateKey}.
     *
     * @returns a {@link PrivateKey}.
     */
    static fromBase58(privateKeyBase58: string): PrivateKey;
    /**
     * Encodes a {@link PrivateKey} into a base58 string.
     * @returns a base58 encoded string
     */
    toBase58(): string;
    /**
     * Static method to encode a {@link PrivateKey} into a base58 string.
     * @returns a base58 encoded string
     */
    static toBase58(privateKey: {
        s: Scalar;
    }): string;
}
/**
 * A public key, which is also an address on the Mina network.
 * You can derive a {@link PublicKey} directly from a {@link PrivateKey}.
 */
declare class PublicKey extends CircuitValue {
    x: Field;
    isOdd: Bool;
    /**
     * Returns the {@link Group} representation of this {@link PublicKey}.
     * @returns A {@link Group}
     */
    toGroup(): Group;
    /**
     * Creates a {@link PublicKey} from a {@link Group} element.
     * @returns a {@link PublicKey}.
     */
    static fromGroup({ x, y }: Group): PublicKey;
    /**
     * Derives a {@link PublicKey} from a {@link PrivateKey}.
     * @returns a {@link PublicKey}.
     */
    static fromPrivateKey({ s }: PrivateKey): PublicKey;
    /**
     * Creates a {@link PublicKey} from a JSON structure element.
     * @returns a {@link PublicKey}.
     */
    static from(g: {
        x: Field;
        isOdd: Bool;
    }): PublicKey;
    /**
     * Creates an empty {@link PublicKey}.
     * @returns an empty {@link PublicKey}
     */
    static empty(): PublicKey;
    /**
     * Checks if a {@link PublicKey} is empty.
     * @returns a {@link Bool}
     */
    isEmpty(): import("./bool.js").Bool;
    /**
     * Decodes a base58 encoded {@link PublicKey} into a {@link PublicKey}.
     * @returns a {@link PublicKey}
     */
    static fromBase58(publicKeyBase58: string): PublicKey;
    /**
     * Encodes a {@link PublicKey} in base58 format.
     * @returns a base58 encoded {@link PublicKey}
     */
    toBase58(): string;
    /**
     * Static method to encode a {@link PublicKey} into base58 format.
     * @returns a base58 encoded {@link PublicKey}
     */
    static toBase58({ x, isOdd }: PublicKey): string;
    /**
     * Serializes a {@link PublicKey} into its JSON representation.
     * @returns a JSON string
     */
    static toJSON(publicKey: PublicKey): string;
    /**
     * Deserializes a JSON string into a {@link PublicKey}.
     * @returns a JSON string
     */
    static fromJSON<T extends AnyConstructor>(this: T, publicKey: string): InstanceType<T>;
}
/**
 * A Schnorr {@link Signature} over the Pasta Curves.
 */
declare class Signature extends CircuitValue {
    r: Field;
    s: Scalar;
    /**
     * Signs a message using a {@link PrivateKey}.
     * @returns a {@link Signature}
     */
    static create(privKey: PrivateKey, msg: Field[]): Signature;
    /**
     * Verifies the {@link Signature} using a message and the corresponding {@link PublicKey}.
     * @returns a {@link Bool}
     */
    verify(publicKey: PublicKey, msg: Field[]): Bool;
    /**
     * Decodes a base58 encoded signature into a {@link Signature}.
     */
    static fromBase58(signatureBase58: string): Signature;
    /**
     * Encodes a {@link Signature} in base58 format.
     */
    toBase58(): string;
}
declare function scaleShifted(point: Group, shiftedScalar: Scalar): import("./group.js").Group;
