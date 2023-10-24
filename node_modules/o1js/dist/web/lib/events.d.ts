import { GenericField, GenericProvableExtended } from '../bindings/lib/generic.js';
export { createEvents, dataAsHash };
type Poseidon<Field> = {
    update(state: Field[], input: Field[]): Field[];
};
declare function createEvents<Field>({ Field, Poseidon, }: {
    Field: GenericField<Field>;
    Poseidon: Poseidon<Field>;
}): {
    Events: {
        toFields: (x: {
            data: Field[][];
            hash: Field;
        }) => Field[];
        toAuxiliary: (x?: {
            data: Field[][];
            hash: Field;
        } | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => {
            data: Field[][];
            hash: Field;
        };
        sizeInFields(): number;
        check: (x: {
            data: Field[][];
            hash: Field;
        }) => void;
        toInput: (x: {
            data: Field[][];
            hash: Field;
        }) => {
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
        toJSON: (x: {
            data: Field[][];
            hash: Field;
        }) => string[][];
        fromJSON: (x: string[][]) => {
            data: Field[][];
            hash: Field;
        };
        emptyValue: (() => {
            data: Field[][];
            hash: Field;
        }) & (() => {
            data: Field[][];
            hash: Field;
        });
        empty(): {
            hash: Field;
            data: Field[][];
        };
        pushEvent(events: {
            hash: Field;
            data: Field[][];
        }, event: Field[]): {
            hash: Field;
            data: Field[][];
        };
        fromList(events: Field[][]): {
            hash: Field;
            data: Field[][];
        };
        hash(events: Field[][]): Field;
    };
    Actions: {
        toFields: (x: {
            data: Field[][];
            hash: Field;
        }) => Field[];
        toAuxiliary: (x?: {
            data: Field[][];
            hash: Field;
        } | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => {
            data: Field[][];
            hash: Field;
        };
        sizeInFields(): number;
        check: (x: {
            data: Field[][];
            hash: Field;
        }) => void;
        toInput: (x: {
            data: Field[][];
            hash: Field;
        }) => {
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
        toJSON: (x: {
            data: Field[][];
            hash: Field;
        }) => string[][];
        fromJSON: (x: string[][]) => {
            data: Field[][];
            hash: Field;
        };
        emptyValue: (() => {
            data: Field[][];
            hash: Field;
        }) & (() => {
            data: Field[][];
            hash: Field;
        });
        empty(): {
            hash: Field;
            data: Field[][];
        };
        pushEvent(actions: {
            hash: Field;
            data: Field[][];
        }, event: Field[]): {
            hash: Field;
            data: Field[][];
        };
        fromList(events: Field[][]): {
            hash: Field;
            data: Field[][];
        };
        hash(events: Field[][]): Field;
        emptyActionState(): Field;
        updateSequenceState(state: Field, sequenceEventsHash: Field): Field;
    };
};
declare function dataAsHash<T, J, Field>({ emptyValue, toJSON, fromJSON, }: {
    emptyValue: () => {
        data: T;
        hash: Field;
    };
    toJSON: (value: T) => J;
    fromJSON: (json: J) => {
        data: T;
        hash: Field;
    };
}): GenericProvableExtended<{
    data: T;
    hash: Field;
}, J, Field> & {
    emptyValue(): {
        data: T;
        hash: Field;
    };
};
