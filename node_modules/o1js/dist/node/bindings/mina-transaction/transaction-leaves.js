import { Field, Bool } from '../../lib/core.js';
import { UInt32, UInt64, Sign } from '../../lib/int.js';
import { PublicKey } from '../../lib/signature.js';
import { derivedLeafTypes } from './derived-leaves.js';
import { createEvents } from '../../lib/events.js';
import { Poseidon, Hash, packToFields, emptyHashWithPrefix, } from '../../lib/hash.js';
import { provable } from '../../lib/circuit_value.js';
import { mocks } from '../crypto/constants.js';
export { PublicKey, Field, Bool, AuthRequired, UInt64, UInt32, Sign, TokenId };
export { Events, Actions, ZkappUri, TokenSymbol, ActionState, VerificationKeyHash, ReceiptChainHash, StateHash, };
const { TokenId, StateHash, TokenSymbol, AuthRequired, ZkappUri } = derivedLeafTypes({ Field, Bool, Hash, packToFields });
const { Events, Actions } = createEvents({ Field, Poseidon });
const ActionState = {
    ...provable(Field),
    emptyValue: Actions.emptyActionState,
};
const VerificationKeyHash = {
    ...provable(Field),
    emptyValue: () => Field(mocks.dummyVerificationKeyHash),
};
const ReceiptChainHash = {
    ...provable(Field),
    emptyValue: () => emptyHashWithPrefix('CodaReceiptEmpty'),
};
//# sourceMappingURL=transaction-leaves.js.map