import { Scalar } from '../../provable/curve-bigint.js';
import { Field } from '../../provable/field-bigint.js';
import { Memo } from './memo.js';
import { Signature } from './signature.js';
export { publicKeyToHex, rosettaTransactionToSignedCommand };
function publicKeyToHex(publicKey) {
    return fieldToHex(Field, publicKey.x, !!publicKey.isOdd);
}
function signatureFromHex(signatureHex) {
    let half = signatureHex.length / 2;
    let fieldHex = signatureHex.slice(0, half);
    let scalarHex = signatureHex.slice(half);
    return {
        r: fieldFromHex(Field, fieldHex)[0],
        s: fieldFromHex(Scalar, scalarHex)[0],
    };
}
function fieldToHex(binable, x, paddingBit = false) {
    let bytes = binable.toBytes(x);
    // set highest bit (which is empty)
    bytes[bytes.length - 1] &= Number(paddingBit) << 7;
    // map each byte to a hex string of length 2
    return bytes
        .map((byte) => byte.toString(16).split('').reverse().join(''))
        .join('');
}
function fieldFromHex(binable, hex) {
    let bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        let byte = parseInt(hex[i + 1] + hex[i], 16);
        bytes.push(byte);
    }
    // read highest bit
    let paddingBit = !!(bytes[bytes.length - 1] >> 7);
    bytes[bytes.length - 1] &= 0x7f;
    return [binable.fromBytes(bytes), paddingBit];
}
// TODO: clean up this logic, was copied over from OCaml code
function rosettaTransactionToSignedCommand({ signature, payment, stake_delegation, }) {
    let signatureDecoded = signatureFromHex(signature);
    let signatureBase58 = Signature.toBase58(signatureDecoded);
    let [t, nonce] = (() => {
        if (payment !== null && stake_delegation === null) {
            let r = payment;
            let command = {
                receiver: r.to,
                source: r.from,
                kind: 'Payment',
                fee_payer: r.from,
                fee_token: r.token,
                fee: r.fee,
                amount: r.amount,
                valid_until: r.valid_until,
                memo: r.memo,
            };
            return [command, r.nonce];
        }
        else if (payment === null && stake_delegation !== null) {
            let r = stake_delegation;
            let command = {
                receiver: r.new_delegate,
                source: r.delegator,
                kind: 'Delegation',
                fee_payer: r.delegator,
                fee_token: '1',
                fee: r.fee,
                amount: null,
                valid_until: r.valid_until,
                memo: r.memo,
            };
            return [command, r.nonce];
        }
        else {
            throw Error('rosettaTransactionToSignedCommand: Unsupported transaction');
        }
    })();
    let payload = (() => {
        let fee_payer_pk = t.fee_payer;
        let source_pk = t.source;
        let receiver_pk = t.receiver;
        let memo = Memo.toBase58(Memo.fromString(t.memo ?? ''));
        let common = {
            fee: t.fee,
            fee_payer_pk,
            nonce,
            valid_until: t.valid_until,
            memo,
        };
        if (t.kind === 'Payment') {
            return {
                common,
                body: ['Payment', { source_pk, receiver_pk, amount: t.amount }],
            };
        }
        else if (t.kind === 'Delegation') {
            return {
                common,
                body: [
                    'Stake_delegation',
                    ['Set_delegate', { delegator: source_pk, new_delegate: receiver_pk }],
                ],
            };
        }
        else
            throw Error('rosettaTransactionToSignedCommand has a bug');
    })();
    return {
        signature: signatureBase58,
        signer: payload.common.fee_payer_pk,
        payload,
    };
}
//# sourceMappingURL=rosetta.js.map