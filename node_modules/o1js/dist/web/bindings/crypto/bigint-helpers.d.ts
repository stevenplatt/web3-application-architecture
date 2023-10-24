export { changeBase, bytesToBigInt, bigIntToBytes };
declare function bytesToBigInt(bytes: Uint8Array | number[]): bigint;
/**
 * Transforms bigint to little-endian array of bytes (numbers between 0 and 255) of a given length.
 * Throws an error if the bigint doesn't fit in the given number of bytes.
 */
declare function bigIntToBytes(x: bigint, length: number): number[];
declare function changeBase(digits: bigint[], base: bigint, newBase: bigint): bigint[];
