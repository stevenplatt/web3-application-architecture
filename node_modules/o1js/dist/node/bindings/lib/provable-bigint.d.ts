import { GenericHashInput, GenericProvableExtended } from './generic.js';
import { BinableWithBits } from './binable.js';
export { provable, ProvableExtended, ProvableBigint, BinableBigint, HashInput };
type Field = bigint;
declare let provable: import("./provable-generic.js").ProvableConstructor<bigint>;
type ProvableExtended<T, J> = GenericProvableExtended<T, J, Field>;
type HashInput = GenericHashInput<Field>;
declare function ProvableBigint<T extends bigint = bigint, TJSON extends string = string>(check: (x: bigint) => void): ProvableExtended<T, TJSON>;
declare function BinableBigint<T extends bigint = bigint>(sizeInBits: number, check: (x: bigint) => void): BinableWithBits<T>;
