import { Gate, Pickles, ProvablePure } from '../snarky.js';
import { Field } from './core.js';
import { AccountUpdate, AccountUpdatesLayout, Permissions, SetOrKeep, ZkappPublicInput } from './account_update.js';
import { FlexibleProvablePure, InferProvable } from './circuit_value.js';
import { Provable } from './provable.js';
import { UInt32, UInt64 } from './int.js';
import { GenericArgument, MethodInterface, Proof } from './proof_system.js';
import { PrivateKey, PublicKey } from './signature.js';
export { SmartContract, method, DeployArgs, declareMethods, Callback, Account, VerificationKey, Reducer, };
/**
 * A decorator to use in a zkApp to mark a method as callable by anyone.
 * You can use inside your zkApp class as:
 *
 * ```
 * \@method myMethod(someArg: Field) {
 *   // your code here
 * }
 * ```
 */
declare function method<T extends SmartContract>(target: T & {
    constructor: any;
}, methodName: keyof T & string, descriptor: PropertyDescriptor): void;
declare class Callback<Result> extends GenericArgument {
    instance: SmartContract;
    methodIntf: MethodInterface & {
        returnType: Provable<Result>;
    };
    args: any[];
    result?: Result;
    accountUpdate: AccountUpdate;
    static create<T extends SmartContract, K extends keyof T>(instance: T, methodName: K, args: T[K] extends (...args: infer A) => any ? A : never): Callback<any>;
    private constructor();
}
/**
 * The main zkapp class. To write a zkapp, extend this class as such:
 *
 * ```
 * class YourSmartContract extends SmartContract {
 *   // your smart contract code here
 * }
 * ```
 *
 */
declare class SmartContract {
    #private;
    address: PublicKey;
    tokenId: Field;
    static _methods?: MethodInterface[];
    static _methodMetadata?: Record<string, {
        actions: number;
        rows: number;
        digest: string;
        hasReturn: boolean;
        gates: Gate[];
    }>;
    static _provers?: Pickles.Prover[];
    static _maxProofsVerified?: 0 | 1 | 2;
    static _verificationKey?: {
        data: string;
        hash: Field;
    };
    /**
     * Returns a Proof type that belongs to this {@link SmartContract}.
     */
    static Proof(): {
        new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
            proof: unknown;
            publicInput: ZkappPublicInput;
            publicOutput: undefined;
            maxProofsVerified: 0 | 2 | 1;
        }): {
            publicInput: ZkappPublicInput;
            publicOutput: undefined;
            proof: unknown;
            maxProofsVerified: 0 | 2 | 1;
            shouldVerify: import("./bool.js").Bool;
            verify(): void;
            verifyIf(condition: import("./bool.js").Bool): void;
            toJSON(): import("./proof_system.js").JsonProof;
        };
        publicInputType: ProvablePure<{
            accountUpdate: import("./field.js").Field;
            calls: import("./field.js").Field;
        }> & {
            toInput: (x: {
                accountUpdate: import("./field.js").Field;
                calls: import("./field.js").Field;
            }) => {
                fields?: import("./field.js").Field[] | undefined;
                packed?: [import("./field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                accountUpdate: import("./field.js").Field;
                calls: import("./field.js").Field;
            }) => {
                accountUpdate: string;
                calls: string;
            };
            fromJSON: (x: {
                accountUpdate: string;
                calls: string;
            }) => {
                accountUpdate: import("./field.js").Field;
                calls: import("./field.js").Field;
            };
        };
        publicOutputType: import("./circuit_value.js").ProvablePureExtended<undefined, null>;
        tag: () => typeof SmartContract;
        fromJSON<S extends (new (...args: any) => Proof<unknown, unknown>) & {
            prototype: Proof<any, any>;
            publicInputType: FlexibleProvablePure<any>;
            publicOutputType: FlexibleProvablePure<any>;
            tag: () => {
                name: string;
            };
            fromJSON: typeof Proof.fromJSON;
        } & {
            prototype: Proof<unknown, unknown>;
        }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("./proof_system.js").JsonProof): Proof<InferProvable<S["publicInputType"]>, InferProvable<S["publicOutputType"]>>;
    };
    constructor(address: PublicKey, tokenId?: Field);
    /**
     * Compile your smart contract.
     *
     * This generates both the prover functions, needed to create proofs for running `@method`s,
     * and the verification key, needed to deploy your zkApp.
     *
     * Although provers and verification key are returned by this method, they are also cached internally and used when needed,
     * so you don't actually have to use the return value of this function.
     *
     * Under the hood, "compiling" means calling into the lower-level [Pickles and Kimchi libraries](https://o1-labs.github.io/proof-systems/kimchi/overview.html) to
     * create multiple prover & verifier indices (one for each smart contract method as part of a "step circuit" and one for the "wrap circuit" which recursively wraps
     * it so that proofs end up in the original finite field). These are fairly expensive operations, so **expect compiling to take at least 20 seconds**,
     * up to several minutes if your circuit is large or your hardware is not optimal for these operations.
     */
    static compile(): Promise<{
        verificationKey: {
            data: string;
            hash: import("./field.js").Field;
        };
        provers: Pickles.Prover[];
        verify: (statement: Pickles.Statement<Uint8Array>, proof: unknown) => Promise<boolean>;
    }>;
    /**
     * Computes a hash of your smart contract, which will reliably change _whenever one of your method circuits changes_.
     * This digest is quick to compute. it is designed to help with deciding whether a contract should be re-compiled or
     * a cached verification key can be used.
     * @returns the digest, as a hex string
     */
    static digest(): string;
    /**
     * Deploys a {@link SmartContract}.
     *
     * ```ts
     * let tx = await Mina.transaction(sender, () => {
     *   AccountUpdate.fundNewAccount(sender);
     *   zkapp.deploy();
     * });
     * tx.sign([senderKey, zkAppKey]);
     * ```
     */
    deploy({ verificationKey, zkappKey, }?: {
        verificationKey?: {
            data: string;
            hash: Field | string;
        };
        zkappKey?: PrivateKey;
    }): void;
    /**
     * `SmartContract.init()` will be called only when a {@link SmartContract} will be first deployed, not for redeployment.
     * This method can be overridden as follows
     * ```
     * class MyContract extends SmartContract {
     *  init() {
     *    super.init();
     *    this.account.permissions.set(...);
     *    this.x.set(Field(1));
     *  }
     * }
     * ```
     */
    init(): void;
    /**
     * Use this command if the account update created by this SmartContract should be signed by the account owner,
     * instead of authorized with a proof.
     *
     * Note that the smart contract's {@link Permissions} determine which updates have to be (can be) authorized by a signature.
     *
     * If you only want to avoid creating proofs for quicker testing, we advise you to
     * use `LocalBlockchain({ proofsEnabled: false })` instead of `requireSignature()`. Setting
     * `proofsEnabled` to `false` allows you to test your transactions with the same authorization flow as in production,
     * with the only difference being that quick mock proofs are filled in instead of real proofs.
     */
    requireSignature(): void;
    /**
     * @deprecated `this.sign()` is deprecated in favor of `this.requireSignature()`
     */
    sign(zkappKey?: PrivateKey): void;
    /**
     * Use this command if the account update created by this SmartContract should have no authorization on it,
     * instead of being authorized with a proof.
     *
     * WARNING: This is a method that should rarely be useful. If you want to disable proofs for quicker testing, take a look
     * at `LocalBlockchain({ proofsEnabled: false })`, which causes mock proofs to be created and doesn't require changing the
     * authorization flow.
     */
    skipAuthorization(): void;
    /**
     * Returns the current {@link AccountUpdate} associated to this {@link SmartContract}.
     */
    get self(): AccountUpdate;
    /**
     * Same as `SmartContract.self` but explicitly creates a new {@link AccountUpdate}.
     */
    newSelf(): AccountUpdate;
    /**
     * The public key of the current transaction's sender account.
     *
     * Throws an error if not inside a transaction, or the sender wasn't passed in.
     *
     * **Warning**: The fact that this public key equals the current sender is not part of the proof.
     * A malicious prover could use any other public key without affecting the validity of the proof.
     */
    get sender(): PublicKey;
    /**
     * Current account of the {@link SmartContract}.
     */
    get account(): import("./precondition.js").Account;
    /**
     * Current network state of the {@link SmartContract}.
     */
    get network(): import("./precondition.js").Network;
    /**
     * Current global slot on the network. This is the slot at which this transaction is included in a block. Since we cannot know this value
     * at the time of transaction construction, this only has the `assertBetween()` method but no `get()` (impossible to implement)
     * or `assertEquals()` (confusing, because the developer can't know the exact slot at which this will be included either)
     */
    get currentSlot(): import("./precondition.js").CurrentSlot;
    /**
     * Token of the {@link SmartContract}.
     */
    get token(): {
        id: import("./field.js").Field;
        parentTokenId: import("./field.js").Field;
        tokenOwner: PublicKey;
        mint({ address, amount, }: {
            address: PublicKey | AccountUpdate | SmartContract;
            amount: number | bigint | UInt64;
        }): AccountUpdate;
        burn({ address, amount, }: {
            address: PublicKey | AccountUpdate | SmartContract;
            amount: number | bigint | UInt64;
        }): AccountUpdate;
        send({ from, to, amount, }: {
            from: PublicKey | AccountUpdate | SmartContract;
            to: PublicKey | AccountUpdate | SmartContract;
            amount: number | bigint | UInt64;
        }): AccountUpdate;
    };
    /**
     * Approve an account update or callback. This will include the account update in the zkApp's public input,
     * which means it allows you to read and use its content in a proof, make assertions about it, and modify it.
     *
     * If this is called with a callback as the first parameter, it will first extract the account update produced by that callback.
     * The extracted account update is returned.
     *
     * ```ts
     * \@method myApprovingMethod(callback: Callback) {
     *   let approvedUpdate = this.approve(callback);
     * }
     * ```
     *
     * Under the hood, "approving" just means that the account update is made a child of the zkApp in the
     * tree of account updates that forms the transaction.
     * The second parameter `layout` allows you to also make assertions about the approved update's _own_ children,
     * by specifying a certain expected layout of children. See {@link AccountUpdate.Layout}.
     *
     * @param updateOrCallback
     * @param layout
     * @returns The account update that was approved (needed when passing in a Callback)
     */
    approve(updateOrCallback: AccountUpdate | Callback<any>, layout?: AccountUpdatesLayout): AccountUpdate;
    send(args: {
        to: PublicKey | AccountUpdate | SmartContract;
        amount: number | bigint | UInt64;
    }): AccountUpdate;
    /**
     * @deprecated use `this.account.tokenSymbol`
     */
    get tokenSymbol(): {
        set(tokenSymbol: string): void;
    };
    /**
     * Balance of this {@link SmartContract}.
     */
    get balance(): {
        addInPlace(x: string | number | bigint | UInt64 | UInt32 | import("./int.js").Int64): void;
        subInPlace(x: string | number | bigint | UInt64 | UInt32 | import("./int.js").Int64): void;
    };
    /**
     * A list of event types that can be emitted using this.emitEvent()`.
     */
    events: {
        [key: string]: FlexibleProvablePure<any>;
    };
    /**
     * Emits an event. Events will be emitted as a part of the transaction and can be collected by archive nodes.
     */
    emitEvent<K extends keyof this['events']>(type: K, event: any): void;
    /**
     * Asynchronously fetches events emitted by this {@link SmartContract} and returns an array of events with their corresponding types.
     * @async
     * @param [start=UInt32.from(0)] - The start height of the events to fetch.
     * @param end - The end height of the events to fetch. If not provided, fetches events up to the latest height.
     * @returns A promise that resolves to an array of objects, each containing the event type and event data for the specified range.
     * @throws If there is an error fetching events from the Mina network.
     * @example
     * const startHeight = UInt32.from(1000);
     * const endHeight = UInt32.from(2000);
     * const events = await myZkapp.fetchEvents(startHeight, endHeight);
     * console.log(events);
     */
    fetchEvents(start?: UInt32, end?: UInt32): Promise<{
        type: string;
        event: {
            data: ProvablePure<any>;
            transactionInfo: {
                transactionHash: string;
                transactionStatus: string;
                transactionMemo: string;
            };
        };
        blockHeight: UInt32;
        blockHash: string;
        parentBlockHash: string;
        globalSlot: UInt32;
        chainStatus: string;
    }[]>;
    static runOutsideCircuit(run: () => void): void;
    /**
     * This function is run internally before compiling a smart contract, to collect metadata about what each of your
     * smart contract methods does.
     *
     * For external usage, this function can be handy because calling it involves running all methods in the same "mode" as `compile()` does,
     * so it serves as a quick-to-run check for whether your contract can be compiled without errors, which can greatly speed up iterating.
     *
     * `analyzeMethods()` will also return the number of `rows` of each of your method circuits (i.e., the number of constraints in the underlying proof system),
     * which is a good indicator for circuit size and the time it will take to create proofs.
     * To inspect the created circuit in detail, you can look at the returned `gates`.
     *
     * Note: If this function was already called before, it will short-circuit and just return the metadata collected the first time.
     *
     * @returns an object, keyed by method name, each entry containing:
     *  - `rows` the size of the constraint system created by this method
     *  - `digest` a digest of the method circuit
     *  - `hasReturn` a boolean indicating whether the method returns a value
     *  - `actions` the number of actions the method dispatches
     *  - `gates` the constraint system, represented as an array of gates
     */
    static analyzeMethods(): Record<string, {
        actions: number;
        rows: number;
        digest: string;
        hasReturn: boolean;
        gates: Gate[];
    }>;
    /**
     * @deprecated use `this.account.<field>.set()`
     */
    setValue<T>(maybeValue: SetOrKeep<T>, value: T): void;
    /**
     * @deprecated use `this.account.permissions.set()`
     */
    setPermissions(permissions: Permissions): void;
}
type Reducer<Action> = {
    actionType: FlexibleProvablePure<Action>;
};
type ReducerReturn<Action> = {
    /**
     * Dispatches an {@link Action}. Similar to normal {@link Event}s,
     * {@link Action}s can be stored by archive nodes and later reduced within a {@link SmartContract} method
     * to change the state of the contract accordingly
     *
     * ```ts
     * this.reducer.dispatch(Field(1)); // emits one action
     * ```
     *
     * */
    dispatch(action: Action): void;
    /**
     * Reduces a list of {@link Action}s, similar to `Array.reduce()`.
     *
     * ```ts
     *  let pendingActions = this.reducer.getActions({
     *    fromActionState: actionState,
     *  });
     *
     *  let { state: newState, actionState: newActionState } =
     *  this.reducer.reduce(
     *     pendingActions,
     *     Field,
     *     (state: Field, _action: Field) => {
     *       return state.add(1);
     *     },
     *     { state: initialState, actionState: initialActionState  }
     *   );
     * ```
     *
     */
    reduce<State>(actions: Action[][], stateType: Provable<State>, reduce: (state: State, action: Action) => State, initial: {
        state: State;
        actionState: Field;
    }, options?: {
        maxTransactionsWithActions?: number;
        skipActionStatePrecondition?: boolean;
    }): {
        state: State;
        actionState: Field;
    };
    /**
     * Perform circuit logic for every {@link Action} in the list.
     *
     * This is a wrapper around {@link reduce} for when you don't need `state`.
     * Accepts the `fromActionState` and returns the updated action state.
     */
    forEach(actions: Action[][], reduce: (action: Action) => void, fromActionState: Field, options?: {
        maxTransactionsWithActions?: number;
        skipActionStatePrecondition?: boolean;
    }): Field;
    /**
     * Fetches the list of previously emitted {@link Action}s by this {@link SmartContract}.
     * ```ts
     * let pendingActions = this.reducer.getActions({
     *    fromActionState: actionState,
     * });
     * ```
     */
    getActions({ fromActionState, endActionState, }?: {
        fromActionState?: Field;
        endActionState?: Field;
    }): Action[][];
    /**
     * Fetches the list of previously emitted {@link Action}s by zkapp {@link SmartContract}.
     * ```ts
     * let pendingActions = await zkapp.reducer.fetchActions({
     *    fromActionState: actionState,
     * });
     * ```
     */
    fetchActions({ fromActionState, endActionState, }: {
        fromActionState?: Field;
        endActionState?: Field;
    }): Promise<Action[][]>;
};
declare const VerificationKey_base: (new (value: {
    data: string;
    hash: import("./field.js").Field;
}) => {
    data: string;
    hash: import("./field.js").Field;
}) & {
    _isStruct: true;
} & Provable<{
    data: string;
    hash: import("./field.js").Field;
}> & {
    toInput: (x: {
        data: string;
        hash: import("./field.js").Field;
    }) => {
        fields?: import("./field.js").Field[] | undefined;
        packed?: [import("./field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        data: string;
        hash: import("./field.js").Field;
    }) => string;
    fromJSON: (x: string) => {
        data: string;
        hash: import("./field.js").Field;
    };
};
declare class VerificationKey extends VerificationKey_base {
}
type DeployArgs = {
    verificationKey?: {
        data: string;
        hash: string | Field;
    };
    zkappKey?: PrivateKey;
} | undefined;
declare function Account(address: PublicKey, tokenId?: Field): import("./precondition.js").Account;
/**
 * `declareMethods` can be used in place of the `@method` decorator
 * to declare SmartContract methods along with their list of arguments.
 * It should be placed _after_ the class declaration.
 * Here is an example of declaring a method `update`, which takes a single argument of type `Field`:
 * ```ts
 * class MyContract extends SmartContract {
 *   // ...
 *   update(x: Field) {
 *     // ...
 *   }
 * }
 * declareMethods(MyContract, { update: [Field] }); // `[Field]` is the list of arguments!
 * ```
 * Note that a method of the same name must still be defined on the class, just without the decorator.
 */
declare function declareMethods<T extends typeof SmartContract>(SmartContract: T, methodArguments: Record<string, Provable<unknown>[]>): void;
declare const Reducer: (<T extends FlexibleProvablePure<any>, A extends InferProvable<T> = InferProvable<T>>(reducer: {
    actionType: T;
}) => ReducerReturn<A>) & {
    initialActionState: Field;
};
