export { Poseidon, PoseidonLegacy };
declare const Poseidon: {
    hashToGroup: (input: bigint[]) => {
        x: bigint;
        y: {
            x0: bigint;
            x1: bigint;
        };
    } | undefined;
    initialState: () => bigint[];
    update: ([...state]: bigint[], input: bigint[]) => bigint[];
    hash: (input: bigint[]) => bigint;
};
declare const PoseidonLegacy: {
    initialState: () => bigint[];
    update: ([...state]: bigint[], input: bigint[]) => bigint[];
    hash: (input: bigint[]) => bigint;
};
