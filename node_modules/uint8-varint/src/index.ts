import type { Uint8ArrayList } from 'uint8arraylist'
import { LongBits } from 'longbits'
import { allocUnsafe } from 'uint8arrays/alloc'

const N1 = Math.pow(2, 7)
const N2 = Math.pow(2, 14)
const N3 = Math.pow(2, 21)
const N4 = Math.pow(2, 28)
const N5 = Math.pow(2, 35)
const N6 = Math.pow(2, 42)
const N7 = Math.pow(2, 49)
const N8 = Math.pow(2, 56)
const N9 = Math.pow(2, 63)

interface VarintCodec {
  encodingLength: (value: number) => number
  encode: ((value: number) => Uint8Array) & ((value: number, buf: Uint8Array, offset?: number) => Uint8Array) & ((value: number, buf: Uint8ArrayList, offset?: number) => Uint8ArrayList)
  decode: (buf: Uint8ArrayList | Uint8Array, offset?: number) => number
}

export const unsigned: VarintCodec = {
  encodingLength  (value: number): number {
    if (value < N1) {
      return 1
    }

    if (value < N2) {
      return 2
    }

    if (value < N3) {
      return 3
    }

    if (value < N4) {
      return 4
    }

    if (value < N5) {
      return 5
    }

    if (value < N6) {
      return 6
    }

    if (value < N7) {
      return 7
    }

    if (value < N8) {
      return 8
    }

    if (value < N9) {
      return 9
    }

    return 10
  },

  encode (value: number, buf?: any, offset: number = 0) {
    if (Number.MAX_SAFE_INTEGER != null && value > Number.MAX_SAFE_INTEGER) {
      throw new RangeError('Could not encode varint')
    }

    if (buf == null) {
      buf = allocUnsafe(unsigned.encodingLength(value))
    }

    LongBits.fromNumber(value).toBytes(buf, offset)

    return buf
  },

  decode (buf: Uint8ArrayList | Uint8Array, offset: number = 0): number {
    return LongBits.fromBytes(buf, offset).toNumber(true)
  }
}

export const signed: VarintCodec = {
  encodingLength (value: number): number {
    if (value < 0) {
      return 10 // 10 bytes per spec - https://developers.google.com/protocol-buffers/docs/encoding#signed-ints
    }

    return unsigned.encodingLength(value)
  },

  encode (value: any, buf?: any, offset?: any) {
    if (buf == null) {
      buf = allocUnsafe(signed.encodingLength(value))
    }

    if (value < 0) {
      LongBits.fromNumber(value).toBytes(buf, offset)

      return buf
    }

    return unsigned.encode(value, buf, offset)
  },

  decode (buf: Uint8ArrayList | Uint8Array, offset = 0): number {
    return LongBits.fromBytes(buf, offset).toNumber(false)
  }
}

export const zigzag: VarintCodec = {
  encodingLength (value: number): number {
    return unsigned.encodingLength(value >= 0 ? value * 2 : value * -2 - 1)
  },

  // @ts-expect-error
  encode (value: any, buf?: any, offset?: any) {
    value = value >= 0 ? value * 2 : (value * -2) - 1

    return unsigned.encode(value, buf, offset)
  },

  decode (buf: Uint8ArrayList | Uint8Array, offset = 0): number {
    const value = unsigned.decode(buf, offset)

    return (value & 1) !== 0 ? (value + 1) / -2 : value / 2
  }
}
