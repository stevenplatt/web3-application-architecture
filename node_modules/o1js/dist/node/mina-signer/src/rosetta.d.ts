import { PublicKey } from '../../provable/curve-bigint.js';
export { publicKeyToHex, rosettaTransactionToSignedCommand };
declare function publicKeyToHex(publicKey: PublicKey): string;
declare function rosettaTransactionToSignedCommand({ signature, payment, stake_delegation, }: RosettaTransactionJson): {
    signature: string;
    signer: string;
    payload: {
        common: {
            fee: string;
            fee_payer_pk: string;
            nonce: string;
            valid_until: string | null;
            memo: string;
        };
        body: (string | {
            source_pk: string;
            receiver_pk: string;
            amount: string;
        })[];
    } | {
        common: {
            fee: string;
            fee_payer_pk: string;
            nonce: string;
            valid_until: string | null;
            memo: string;
        };
        body: (string | (string | {
            delegator: string;
            new_delegate: string;
        })[])[];
    };
};
type RosettaTransactionJson = {
    signature: string;
    payment: {
        to: string;
        from: string;
        fee: string;
        token: string;
        nonce: string;
        memo: string | null;
        amount: string;
        valid_until: string | null;
    } | null;
    stake_delegation: {
        delegator: string;
        new_delegate: string;
        fee: string;
        nonce: string;
        memo: string | null;
        valid_until: string | null;
    } | null;
};
