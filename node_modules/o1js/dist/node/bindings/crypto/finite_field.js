import { bytesToBigInt } from './bigint-helpers.js';
import { randomBytes } from './random.js';
export { Fp, Fq, p, q, mod, inverse };
// CONSTANTS
// the modulus. called `p` in most of our code.
const p = 0x40000000000000000000000000000000224698fc094cf91b992d30ed00000001n;
const q = 0x40000000000000000000000000000000224698fc0994a8dd8c46eb2100000001n;
// this is `t`, where p = 2^32 * t + 1
const pMinusOneOddFactor = 0x40000000000000000000000000000000224698fc094cf91b992d30edn;
const qMinusOneOddFactor = 0x40000000000000000000000000000000224698fc0994a8dd8c46eb21n;
// primitive roots of unity, computed as (5^t mod p). this works because 5 generates the multiplicative group mod p
const twoadicRootFp = 0x2bce74deac30ebda362120830561f81aea322bf2b7bb7584bdad6fabd87ea32fn;
const twoadicRootFq = 0x2de6a9b8746d3f589e5c4dfd492ae26e9bb97ea3c106f049a70e2c1102b6d05fn;
// GENERAL FINITE FIELD ALGORITHMS
function mod(x, p) {
    x = x % p;
    if (x < 0)
        return x + p;
    return x;
}
// modular exponentiation, a^n % p
function power(a, n, p) {
    a = mod(a, p);
    let x = 1n;
    for (; n > 0n; n >>= 1n) {
        if (n & 1n)
            x = mod(x * a, p);
        a = mod(a * a, p);
    }
    return x;
}
// inverting with EGCD, 1/a in Z_p
function inverse(a, p) {
    a = mod(a, p);
    if (a === 0n)
        return undefined;
    let b = p;
    let x = 0n;
    let y = 1n;
    let u = 1n;
    let v = 0n;
    while (a !== 0n) {
        let q = b / a;
        let r = mod(b, a);
        let m = x - u * q;
        let n = y - v * q;
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    if (b !== 1n)
        return undefined;
    return mod(x, p);
}
let precomputed_c = {};
function sqrt(n, p, Q, z) {
    // https://en.wikipedia.org/wiki/Tonelli-Shanks_algorithm#The_algorithm
    // variable naming is the same as in that link ^
    // Q is what we call `t` elsewhere - the odd factor in p - 1
    // z is a known non-square mod p. we pass in the primitive root of unity
    let M = 32n;
    let c = precomputed_c[p.toString()] ||
        (precomputed_c[p.toString()] = power(z, Q, p)); // z^Q
    // TODO: can we save work by sharing computation between t and R?
    let t = power(n, Q, p); // n^Q
    let R = power(n, (Q + 1n) / 2n, p); // n^((Q + 1)/2)
    while (true) {
        if (t === 0n)
            return 0n;
        if (t === 1n)
            return R;
        // use repeated squaring to find the least i, 0 < i < M, such that t^(2^i) = 1
        let i = 0n;
        let s = t;
        while (s !== 1n) {
            s = mod(s * s, p);
            i = i + 1n;
        }
        if (i === M)
            return undefined; // no solution
        let b = power(c, 1n << (M - i - 1n), p); // c^(2^(M-i-1))
        M = i;
        c = mod(b * b, p);
        t = mod(t * c, p);
        R = mod(R * b, p);
    }
}
function isSquare(x, p) {
    if (x === 0n)
        return true;
    let sqrt1 = power(x, (p - 1n) / 2n, p);
    return sqrt1 === 1n;
}
function randomField(p) {
    // strategy: find random 255-bit bigints and use the first that's smaller than p
    while (true) {
        let bytes = randomBytes(32);
        bytes[31] &= 0x7f; // zero highest bit, so we get 255 random bits
        let x = bytesToBigInt(bytes);
        if (x < p)
            return x;
    }
}
// SPECIALIZATIONS TO FP, FQ
// these should be mostly trivial
const Fp = createField(p, pMinusOneOddFactor, twoadicRootFp);
const Fq = createField(q, qMinusOneOddFactor, twoadicRootFq);
function createField(p, t, twoadicRoot) {
    return {
        modulus: p,
        sizeInBits: 255,
        t,
        twoadicRoot,
        add(x, y) {
            return mod(x + y, p);
        },
        negate(x) {
            return x === 0n ? 0n : p - x;
        },
        sub(x, y) {
            return mod(x - y, p);
        },
        mul(x, y) {
            return mod(x * y, p);
        },
        inverse(x) {
            return inverse(x, p);
        },
        div(x, y) {
            let yinv = inverse(y, p);
            if (yinv === undefined)
                return;
            return mod(x * yinv, p);
        },
        square(x) {
            return mod(x * x, p);
        },
        isSquare(x) {
            return isSquare(x, p);
        },
        sqrt(x) {
            return sqrt(x, p, t, twoadicRoot);
        },
        power(x, n) {
            return power(x, n, p);
        },
        dot(x, y) {
            let z = 0n;
            let n = x.length;
            for (let i = 0; i < n; i++) {
                z += x[i] * y[i];
            }
            return mod(z, p);
        },
        equal(x, y) {
            return mod(x - y, p) === 0n;
        },
        isEven(x) {
            return !(x & 1n);
        },
        random() {
            return randomField(p);
        },
        fromNumber(x) {
            return mod(BigInt(x), p);
        },
        fromBigint(x) {
            return mod(x, p);
        },
    };
}
//# sourceMappingURL=finite_field.js.map