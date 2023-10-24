import { Bool, Field } from './core.js';
import { circuitValueEquals } from './circuit_value.js';
import { Provable } from './provable.js';
import * as Mina from './mina.js';
import { Actions, Preconditions } from './account_update.js';
import { Int64, UInt32, UInt64 } from './int.js';
import { jsLayout } from '../bindings/mina-transaction/gen/js-layout.js';
import { emptyReceiptChainHash, TokenSymbol } from './hash.js';
import { PublicKey } from './signature.js';
import { ZkappUri } from '../bindings/mina-transaction/transaction-leaves.js';
export { preconditions, Account, Network, CurrentSlot, assertPreconditionInvariants, cleanPreconditionsCache, getAccountPreconditions, };
function preconditions(accountUpdate, isSelf) {
    initializePreconditions(accountUpdate, isSelf);
    return {
        account: Account(accountUpdate),
        network: Network(accountUpdate),
        currentSlot: CurrentSlot(accountUpdate),
    };
}
// note: please keep the two precondition implementations separate
// so we can add customized fields easily
function Network(accountUpdate) {
    let layout = jsLayout.AccountUpdate.entries.body.entries.preconditions.entries.network;
    let context = getPreconditionContextExn(accountUpdate);
    let network = preconditionClass(layout, 'network', accountUpdate, context);
    let timestamp = {
        get() {
            let slot = network.globalSlotSinceGenesis.get();
            return globalSlotToTimestamp(slot);
        },
        getAndAssertEquals() {
            let slot = network.globalSlotSinceGenesis.getAndAssertEquals();
            return globalSlotToTimestamp(slot);
        },
        assertEquals(value) {
            let { genesisTimestamp, slotTime } = Mina.activeInstance.getNetworkConstants();
            let slot = timestampToGlobalSlot(value, `Timestamp precondition unsatisfied: the timestamp can only equal numbers of the form ${genesisTimestamp} + k*${slotTime},\n` +
                `i.e., the genesis timestamp plus an integer number of slots.`);
            return network.globalSlotSinceGenesis.assertEquals(slot);
        },
        assertBetween(lower, upper) {
            let [slotLower, slotUpper] = timestampToGlobalSlotRange(lower, upper);
            return network.globalSlotSinceGenesis.assertBetween(slotLower, slotUpper);
        },
        assertNothing() {
            return network.globalSlotSinceGenesis.assertNothing();
        },
    };
    return { ...network, timestamp };
}
function Account(accountUpdate) {
    let layout = jsLayout.AccountUpdate.entries.body.entries.preconditions.entries.account;
    let context = getPreconditionContextExn(accountUpdate);
    let identity = (x) => x;
    let update = {
        delegate: {
            ...preconditionSubclass(accountUpdate, 'account.delegate', PublicKey, context),
            ...updateSubclass(accountUpdate, 'delegate', identity),
        },
        verificationKey: updateSubclass(accountUpdate, 'verificationKey', identity),
        permissions: updateSubclass(accountUpdate, 'permissions', identity),
        zkappUri: updateSubclass(accountUpdate, 'zkappUri', ZkappUri.fromJSON),
        tokenSymbol: updateSubclass(accountUpdate, 'tokenSymbol', TokenSymbol.from),
        timing: updateSubclass(accountUpdate, 'timing', identity),
        votingFor: updateSubclass(accountUpdate, 'votingFor', identity),
    };
    return {
        ...preconditionClass(layout, 'account', accountUpdate, context),
        ...update,
    };
}
function updateSubclass(accountUpdate, key, transform) {
    return {
        set(value) {
            accountUpdate.body.update[key].isSome = Bool(true);
            accountUpdate.body.update[key].value = transform(value);
        },
    };
}
function CurrentSlot(accountUpdate) {
    let context = getPreconditionContextExn(accountUpdate);
    return {
        assertBetween(lower, upper) {
            context.constrained.add('validWhile');
            let property = accountUpdate.body.preconditions.validWhile;
            property.isSome = Bool(true);
            property.value.lower = lower;
            property.value.upper = upper;
        },
    };
}
let unimplementedPreconditions = [
    // unimplemented because its not checked in the protocol
    'network.stakingEpochData.seed',
    'network.nextEpochData.seed',
];
let baseMap = { UInt64, UInt32, Field, Bool, PublicKey };
function preconditionClass(layout, baseKey, accountUpdate, context) {
    if (layout.type === 'option') {
        // range condition
        if (layout.optionType === 'closedInterval') {
            let lower = layout.inner.entries.lower.type;
            let baseType = baseMap[lower];
            return preconditionSubClassWithRange(accountUpdate, baseKey, baseType, context);
        }
        // value condition
        else if (layout.optionType === 'flaggedOption') {
            let baseType = baseMap[layout.inner.type];
            return preconditionSubclass(accountUpdate, baseKey, baseType, context);
        }
    }
    else if (layout.type === 'array') {
        return {}; // not applicable yet, TODO if we implement state
    }
    else if (layout.type === 'object') {
        // for each field, create a recursive object
        return Object.fromEntries(layout.keys.map((key) => {
            let value = layout.entries[key];
            return [
                key,
                preconditionClass(value, `${baseKey}.${key}`, accountUpdate, context),
            ];
        }));
    }
    else
        throw Error('bug');
}
function preconditionSubClassWithRange(accountUpdate, longKey, fieldType, context) {
    return {
        ...preconditionSubclass(accountUpdate, longKey, fieldType, context),
        assertBetween(lower, upper) {
            context.constrained.add(longKey);
            let property = getPath(accountUpdate.body.preconditions, longKey);
            property.isSome = Bool(true);
            property.value.lower = lower;
            property.value.upper = upper;
        },
    };
}
function preconditionSubclass(accountUpdate, longKey, fieldType, context) {
    if (fieldType === undefined) {
        throw Error(`this.${longKey}: fieldType undefined`);
    }
    let obj = {
        get() {
            if (unimplementedPreconditions.includes(longKey)) {
                let self = context.isSelf ? 'this' : 'accountUpdate';
                throw Error(`${self}.${longKey}.get() is not implemented yet.`);
            }
            let { read, vars } = context;
            read.add(longKey);
            return (vars[longKey] ?? (vars[longKey] = getVariable(accountUpdate, longKey, fieldType)));
        },
        getAndAssertEquals() {
            let value = obj.get();
            obj.assertEquals(value);
            return value;
        },
        assertEquals(value) {
            context.constrained.add(longKey);
            let property = getPath(accountUpdate.body.preconditions, longKey);
            if ('isSome' in property) {
                property.isSome = Bool(true);
                if ('lower' in property.value && 'upper' in property.value) {
                    property.value.lower = value;
                    property.value.upper = value;
                }
                else {
                    property.value = value;
                }
            }
            else {
                setPath(accountUpdate.body.preconditions, longKey, value);
            }
        },
        assertNothing() {
            context.constrained.add(longKey);
        },
    };
    return obj;
}
function getVariable(accountUpdate, longKey, fieldType) {
    return Provable.witness(fieldType, () => {
        let [accountOrNetwork, ...rest] = longKey.split('.');
        let key = rest.join('.');
        let value;
        if (accountOrNetwork === 'account') {
            let account = getAccountPreconditions(accountUpdate.body);
            value = account[key];
        }
        else if (accountOrNetwork === 'network') {
            let networkState = Mina.getNetworkState();
            value = getPath(networkState, key);
        }
        else if (accountOrNetwork === 'validWhile') {
            let networkState = Mina.getNetworkState();
            value = networkState.globalSlotSinceGenesis;
        }
        else {
            throw Error('impossible');
        }
        return value;
    });
}
function globalSlotToTimestamp(slot) {
    let { genesisTimestamp, slotTime } = Mina.activeInstance.getNetworkConstants();
    return UInt64.from(slot).mul(slotTime).add(genesisTimestamp);
}
function timestampToGlobalSlot(timestamp, message) {
    let { genesisTimestamp, slotTime } = Mina.activeInstance.getNetworkConstants();
    let { quotient: slot, rest } = timestamp
        .sub(genesisTimestamp)
        .divMod(slotTime);
    rest.value.assertEquals(Field(0), message);
    return slot.toUInt32();
}
function timestampToGlobalSlotRange(tsLower, tsUpper) {
    // we need `slotLower <= current slot <= slotUpper` to imply `tsLower <= current timestamp <= tsUpper`
    // so we have to make the range smaller -- round up `tsLower` and round down `tsUpper`
    // also, we should clamp to the UInt32 max range [0, 2**32-1]
    let { genesisTimestamp, slotTime } = Mina.activeInstance.getNetworkConstants();
    let tsLowerInt = Int64.from(tsLower)
        .sub(genesisTimestamp)
        .add(slotTime)
        .sub(1);
    let lowerCapped = Provable.if(tsLowerInt.isPositive(), UInt64, tsLowerInt.magnitude, UInt64.from(0));
    let slotLower = lowerCapped.div(slotTime).toUInt32Clamped();
    // unsafe `sub` means the error in case tsUpper underflows slot 0 is ugly, but should not be relevant in practice
    let slotUpper = tsUpper.sub(genesisTimestamp).div(slotTime).toUInt32Clamped();
    return [slotLower, slotUpper];
}
function getAccountPreconditions(body) {
    let { publicKey, tokenId } = body;
    let hasAccount = Mina.hasAccount(publicKey, tokenId);
    if (!hasAccount) {
        return {
            balance: UInt64.zero,
            nonce: UInt32.zero,
            receiptChainHash: emptyReceiptChainHash(),
            actionState: Actions.emptyActionState(),
            delegate: publicKey,
            provedState: Bool(false),
            isNew: Bool(true),
        };
    }
    let account = Mina.getAccount(publicKey, tokenId);
    return {
        balance: account.balance,
        nonce: account.nonce,
        receiptChainHash: account.receiptChainHash,
        actionState: account.zkapp?.actionState?.[0] ?? Actions.emptyActionState(),
        delegate: account.delegate ?? account.publicKey,
        provedState: account.zkapp?.provedState ?? Bool(false),
        isNew: Bool(false),
    };
}
function initializePreconditions(accountUpdate, isSelf) {
    preconditionContexts.set(accountUpdate, {
        read: new Set(),
        constrained: new Set(),
        vars: {},
        isSelf,
    });
}
function cleanPreconditionsCache(accountUpdate) {
    let context = preconditionContexts.get(accountUpdate);
    if (context !== undefined)
        context.vars = {};
}
function assertPreconditionInvariants(accountUpdate) {
    let context = getPreconditionContextExn(accountUpdate);
    let self = context.isSelf ? 'this' : 'accountUpdate';
    let dummyPreconditions = Preconditions.ignoreAll();
    for (let preconditionPath of context.read) {
        // check if every precondition that was read was also contrained
        if (context.constrained.has(preconditionPath))
            continue;
        // check if the precondition was modified manually, which is also a valid way of avoiding an error
        let precondition = getPath(accountUpdate.body.preconditions, preconditionPath);
        let dummy = getPath(dummyPreconditions, preconditionPath);
        if (!circuitValueEquals(precondition, dummy))
            continue;
        // we accessed a precondition field but not constrained it explicitly - throw an error
        let hasAssertBetween = isRangeCondition(precondition);
        let shortPath = preconditionPath.split('.').pop();
        let errorMessage = `You used \`${self}.${preconditionPath}.get()\` without adding a precondition that links it to the actual ${shortPath}.
Consider adding this line to your code:
${self}.${preconditionPath}.assertEquals(${self}.${preconditionPath}.get());${hasAssertBetween
            ? `
You can also add more flexible preconditions with \`${self}.${preconditionPath}.assertBetween(...)\`.`
            : ''}`;
        throw Error(errorMessage);
    }
}
function getPreconditionContextExn(accountUpdate) {
    let c = preconditionContexts.get(accountUpdate);
    if (c === undefined)
        throw Error('bug: precondition context not found');
    return c;
}
const preconditionContexts = new WeakMap();
function isRangeCondition(condition) {
    return 'isSome' in condition && 'lower' in condition.value;
}
// helper. getPath({a: {b: 'x'}}, 'a.b') === 'x'
// TODO: would be awesome to type this
function getPath(obj, path) {
    let pathArray = path.split('.').reverse();
    while (pathArray.length > 0) {
        let key = pathArray.pop();
        obj = obj[key];
    }
    return obj;
}
function setPath(obj, path, value) {
    let pathArray = path.split('.');
    let key = pathArray.pop();
    getPath(obj, pathArray.join('.'))[key] = value;
}
//# sourceMappingURL=precondition.js.map