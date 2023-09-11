/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive Protobuf encoded messages over
 * streams.
 *
 * @example
 *
 * ```typescript
 * import { pbStream } from 'it-pb-stream'
 * import { MessageType } from './src/my-message-type.js'
 *
 * // RequestType and ResponseType have been generate from `.proto` files and have
 * // `.encode` and `.decode` methods for serialization/deserialization
 *
 * const stream = pbStream(duplex)
 * stream.writePB({
 *   foo: 'bar'
 * }, MessageType)
 * const res = await stream.readPB(MessageType)
 * ```
 */

import { handshake } from 'it-handshake'
import * as lp from 'it-length-prefixed'
import type { Duplex } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'

/**
 * A protobuf decoder - takes a byte array and returns an object
 */
export interface Decoder<T> {
  (data: Uint8Array | Uint8ArrayList): T
}

/**
 * A protobuf encoder - takes an object and returns a byte array
 */
export interface Encoder<T> {
  (data: T): Uint8Array
}

/**
 * Convinience methods for working with protobuf streams
 */
export interface ProtobufStream {
  /**
   * Read a set number of bytes from the stream
   */
  read: (bytes?: number) => Promise<Uint8ArrayList>

  /**
   * Read the next length-prefixed number of bytes from the stream
   */
  readLP: () => Promise<Uint8ArrayList>

  /**
   * Read the next length-prefixed byte array from the stream and decode it as the passed protobuf format
   */
  readPB: <T>(proto: { decode: Decoder<T> }) => Promise<T>

  /**
   * Write the passed bytes to the stream
   */
  write: (input: Uint8Array | Uint8ArrayList) => void

  /**
   * Write the passed bytes to the stream prefixed by their length
   */
  writeLP: (input: Uint8Array | Uint8ArrayList) => void

  /**
   * Encode the passed object as a protobuf message and write it's length-prefixed bytes tot he stream
   */
  writePB: <T>(data: T, proto: {encode: Encoder<T>}) => void

  /**
   * Returns an object with read/write methods for operating on protobuf messages
   */
  pb: <T> (proto: {encode: Encoder<T>, decode: Decoder<T> }) => {read: () => Promise<T>, write: (d: T) => void}

  /**
   * Returns the underlying stream
   */
  unwrap: () => Duplex<Uint8ArrayList, Uint8Array>
}

export interface Opts {
  // encoding opts
  poolSize: number
  minPoolSize: number
  lengthEncoder: lp.LengthEncoderFunction

  // decoding opts
  lengthDecoder: lp.LengthDecoderFunction
  maxLengthLength: number
  maxDataLength: number
}

export function pbStream (duplex: Duplex<Uint8ArrayList | Uint8Array, Uint8Array>, opts = {}): ProtobufStream {
  const shake = handshake(duplex)
  const lpReader = lp.decode.fromReader(
    shake.reader,
    opts
  )

  const W: ProtobufStream = {
    read: async (bytes) => {
      // just read
      const { value } = await shake.reader.next(bytes)

      if (value == null) {
        throw new Error('Value is null')
      }

      return value
    },
    readLP: async () => {
      // read, decode
      // @ts-expect-error .next is part of the generator interface
      const { value } = await lpReader.next()

      if (value == null) {
        throw new Error('Value is null')
      }

      return value
    },
    readPB: async (proto) => {
      // readLP, decode
      const value = await W.readLP()

      if (value == null) {
        throw new Error('Value is null')
      }

      // Is this a buffer?
      const buf = value instanceof Uint8Array ? value : value.subarray()

      return proto.decode(buf)
    },
    write: (data) => {
      // just write
      if (data instanceof Uint8Array) {
        shake.writer.push(data)
      } else {
        shake.writer.push(data.subarray())
      }
    },
    writeLP: (data) => {
      // encode, write
      W.write(lp.encode.single(data, opts))
    },
    writePB: (data, proto) => {
      // encode, writeLP
      W.writeLP(proto.encode(data))
    },
    pb: (proto) => {
      return {
        read: async () => await W.readPB(proto),
        write: (d) => W.writePB(d, proto)
      }
    },
    unwrap: () => {
      // returns vanilla duplex again, terminates all reads/writes from this object
      shake.rest()
      return shake.stream
    }
  }

  return W
}
