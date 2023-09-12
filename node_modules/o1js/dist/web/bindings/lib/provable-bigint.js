import { bigIntToBytes } from '../crypto/bigint-helpers.js';
import { createProvable } from './provable-generic.js';
import { defineBinable, withBits } from './binable.js';
export { provable, ProvableBigint, BinableBigint };
let provable = createProvable();
function ProvableBigint(check) {
    return {
        sizeInFields() {
            return 1;
        },
        toFields(x) {
            return [x];
        },
        toAuxiliary() {
            return [];
        },
        check,
        fromFields([x]) {
            check(x);
            return x;
        },
        toInput(x) {
            return { fields: [x], packed: [] };
        },
        toJSON(x) {
            return x.toString();
        },
        fromJSON(json) {
            if (isNaN(json) || isNaN(parseFloat(json))) {
                throw Error(`fromJSON: expected a numeric string, got "${json}"`);
            }
            let x = BigInt(json);
            check(x);
            return x;
        },
    };
}
function BinableBigint(sizeInBits, check) {
    let sizeInBytes = Math.ceil(sizeInBits / 8);
    return withBits(defineBinable({
        toBytes(x) {
            return bigIntToBytes(x, sizeInBytes);
        },
        readBytes(bytes, start) {
            let x = 0n;
            let bitPosition = 0n;
            let end = Math.min(start + sizeInBytes, bytes.length);
            for (let i = start; i < end; i++) {
                x += BigInt(bytes[i]) << bitPosition;
                bitPosition += 8n;
            }
            check(x);
            return [x, end];
        },
    }), sizeInBits);
}
//# sourceMappingURL=provable-bigint.js.map