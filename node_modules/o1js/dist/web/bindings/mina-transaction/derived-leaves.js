import { createProvable } from '../lib/provable-generic.js';
import { bytesToBits, prefixToField, stringLengthInBytes, stringToBytes, } from '../lib/binable.js';
import { fieldEncodings } from '../../lib/base58.js';
import { dataAsHash } from '../../lib/events.js';
import { prefixes } from '../crypto/constants.js';
export { derivedLeafTypes, tokenSymbolLength };
const tokenSymbolLength = 6;
function derivedLeafTypes({ Field, Bool, Hash, packToFields, }) {
    let provable = createProvable();
    const Encoding = fieldEncodings(Field);
    const defaultTokenId = 1;
    const TokenId = {
        ...provable(Field),
        emptyValue() {
            return Field(defaultTokenId);
        },
        toJSON(x) {
            return Encoding.TokenId.toBase58(x);
        },
        fromJSON(x) {
            return Encoding.TokenId.fromBase58(x);
        },
    };
    const StateHash = {
        ...provable(Field),
        toJSON(x) {
            return Encoding.StateHash.toBase58(x);
        },
        fromJSON(x) {
            return Encoding.StateHash.fromBase58(x);
        },
    };
    const TokenSymbol = {
        ...provable({ field: Field, symbol: String }),
        toInput({ field }) {
            return { packed: [[field, 48]] };
        },
        toJSON({ symbol }) {
            return symbol;
        },
        fromJSON(symbol) {
            let bytesLength = stringLengthInBytes(symbol);
            if (bytesLength > tokenSymbolLength)
                throw Error(`Token symbol ${symbol} should be a maximum of 6 bytes, but is ${bytesLength}`);
            return { symbol, field: prefixToField(Field, symbol) };
        },
    };
    const AuthRequired = {
        ...provable({ constant: Bool, signatureNecessary: Bool, signatureSufficient: Bool }, {
            customObjectKeys: [
                'constant',
                'signatureNecessary',
                'signatureSufficient',
            ],
        }),
        emptyValue() {
            return {
                constant: Bool(true),
                signatureNecessary: Bool(false),
                signatureSufficient: Bool(true),
            };
        },
        toJSON(x) {
            let c = Number(Bool.toJSON(x.constant));
            let n = Number(Bool.toJSON(x.signatureNecessary));
            let s = Number(Bool.toJSON(x.signatureSufficient));
            // prettier-ignore
            switch (`${c}${n}${s}`) {
                case '110': return 'Impossible';
                case '101': return 'None';
                case '000': return 'Proof';
                case '011': return 'Signature';
                case '001': return 'Either';
                default: throw Error('Unexpected permission');
            }
        },
        fromJSON(json) {
            let map = {
                Impossible: '110',
                None: '101',
                Proof: '000',
                Signature: '011',
                Either: '001',
            };
            let code = map[json];
            if (code === undefined)
                throw Error('Unexpected permission');
            let [constant, signatureNecessary, signatureSufficient] = code
                .split('')
                .map((s) => Bool(!!Number(s)));
            return { constant, signatureNecessary, signatureSufficient };
        },
    };
    // Mina_base.Zkapp_account.hash_zkapp_uri_opt
    function hashZkappUri(uri) {
        let bits = bytesToBits(stringToBytes(uri));
        bits.push(true);
        let input = { packed: bits.map((b) => [Field(Number(b)), 1]) };
        let packed = packToFields(input);
        return Hash.hashWithPrefix(prefixes.zkappUri, packed);
    }
    const ZkappUri = dataAsHash({
        emptyValue() {
            let hash = Hash.hashWithPrefix(prefixes.zkappUri, [Field(0), Field(0)]);
            return { data: '', hash };
        },
        toJSON(data) {
            return data;
        },
        fromJSON(json) {
            return { data: json, hash: hashZkappUri(json) };
        },
    });
    return { TokenId, StateHash, TokenSymbol, AuthRequired, ZkappUri };
}
//# sourceMappingURL=derived-leaves.js.map