export { Pallas, Vesta, GroupAffine, GroupProjective, GroupMapPallas };
type GroupProjective = {
    x: bigint;
    y: bigint;
    z: bigint;
};
type GroupAffine = {
    x: bigint;
    y: bigint;
    infinity: boolean;
};
declare const GroupMapPallas: {
    potentialXs: (t: bigint) => [bigint, bigint, bigint];
    tryDecode: (x: bigint) => {
        x: bigint;
        y: bigint;
    } | undefined;
};
declare const Pallas: {
    zero: {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    one: GroupProjective;
    endoBase: bigint;
    endoScalar: bigint;
    b: bigint;
    a: bigint;
    equal(g: GroupProjective, h: GroupProjective): boolean;
    isOnCurve(g: GroupProjective): boolean;
    add(g: GroupProjective, h: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    double(g: GroupProjective): GroupProjective;
    negate(g: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    sub(g: GroupProjective, h: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    scale(g: GroupProjective, s: bigint): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    endomorphism({ x, y, z }: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    toAffine(g: GroupProjective): GroupAffine;
    fromAffine({ x, y, infinity }: GroupAffine): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
};
declare const Vesta: {
    zero: {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    one: GroupProjective;
    endoBase: bigint;
    endoScalar: bigint;
    b: bigint;
    a: bigint;
    equal(g: GroupProjective, h: GroupProjective): boolean;
    isOnCurve(g: GroupProjective): boolean;
    add(g: GroupProjective, h: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    double(g: GroupProjective): GroupProjective;
    negate(g: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    sub(g: GroupProjective, h: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    scale(g: GroupProjective, s: bigint): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    endomorphism({ x, y, z }: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    toAffine(g: GroupProjective): GroupAffine;
    fromAffine({ x, y, infinity }: GroupAffine): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
};
