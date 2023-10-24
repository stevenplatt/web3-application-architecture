import { Field, Bool, UInt32, UInt64, Sign, } from '../../provable/field-bigint.js';
import { PublicKey } from '../../provable/curve-bigint.js';
import { derivedLeafTypes } from './derived-leaves.js';
import { createEvents } from '../../lib/events.js';
import { Poseidon, Hash, packToFields, } from '../../provable/poseidon-bigint.js';
import { mocks } from '../crypto/constants.js';
export { PublicKey, Field, Bool, AuthRequired, UInt64, UInt32, Sign, TokenId };
export { Events, Actions, ZkappUri, TokenSymbol, ActionState, VerificationKeyHash, ReceiptChainHash, StateHash, };
const { TokenId, StateHash, TokenSymbol, AuthRequired, ZkappUri } = derivedLeafTypes({ Field, Bool, Hash, packToFields });
const { Events, Actions } = createEvents({ Field, Poseidon });
const ActionState = {
    ...Field,
    emptyValue: Actions.emptyActionState,
};
const VerificationKeyHash = {
    ...Field,
    emptyValue: () => Field(mocks.dummyVerificationKeyHash),
};
const ReceiptChainHash = {
    ...Field,
    emptyValue: () => Hash.emptyHashWithPrefix('CodaReceiptEmpty'),
};
//# sourceMappingURL=transaction-leaves-bigint.js.map