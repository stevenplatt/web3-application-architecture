// @generated this file is auto-generated - don't edit it directly
import { PublicKey, UInt64, UInt32, TokenId, Field, Bool, AuthRequired, Sign, ZkappUri, TokenSymbol, StateHash, Events, Actions, ActionState, VerificationKeyHash, ReceiptChainHash, } from '../transaction-leaves.js';
import { ProvableFromLayout } from '../../lib/from-layout.js';
import * as Json from './transaction-json.js';
import { jsLayout } from './js-layout.js';
export { customTypes, ZkappCommand, AccountUpdate, Account };
export { Json };
export * from '../transaction-leaves.js';
export { provableFromLayout, toJSONEssential, emptyValue, TypeMap };
const TypeMap = {
    PublicKey,
    UInt64,
    UInt32,
    TokenId,
    Field,
    Bool,
    AuthRequired,
    Sign,
};
let customTypes = {
    ZkappUri,
    TokenSymbol,
    StateHash,
    Events,
    Actions,
    ActionState,
    VerificationKeyHash,
    ReceiptChainHash,
};
let { provableFromLayout, toJSONEssential, emptyValue } = ProvableFromLayout(TypeMap, customTypes);
let ZkappCommand = provableFromLayout(jsLayout.ZkappCommand);
let AccountUpdate = provableFromLayout(jsLayout.AccountUpdate);
let Account = provableFromLayout(jsLayout.Account);
//# sourceMappingURL=transaction.js.map