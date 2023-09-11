/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
import { encodeMessage, decodeMessage, message } from 'protons-runtime';
export var NoiseExtensions;
(function (NoiseExtensions) {
    let _codec;
    NoiseExtensions.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if (obj.webtransportCerthashes != null) {
                    for (const value of obj.webtransportCerthashes) {
                        w.uint32(10);
                        w.bytes(value);
                    }
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length) => {
                const obj = {
                    webtransportCerthashes: []
                };
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            obj.webtransportCerthashes.push(reader.bytes());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    NoiseExtensions.encode = (obj) => {
        return encodeMessage(obj, NoiseExtensions.codec());
    };
    NoiseExtensions.decode = (buf) => {
        return decodeMessage(buf, NoiseExtensions.codec());
    };
})(NoiseExtensions || (NoiseExtensions = {}));
export var NoiseHandshakePayload;
(function (NoiseHandshakePayload) {
    let _codec;
    NoiseHandshakePayload.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if (opts.writeDefaults === true || (obj.identityKey != null && obj.identityKey.byteLength > 0)) {
                    w.uint32(10);
                    w.bytes(obj.identityKey);
                }
                if (opts.writeDefaults === true || (obj.identitySig != null && obj.identitySig.byteLength > 0)) {
                    w.uint32(18);
                    w.bytes(obj.identitySig);
                }
                if (obj.extensions != null) {
                    w.uint32(34);
                    NoiseExtensions.codec().encode(obj.extensions, w, {
                        writeDefaults: false
                    });
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length) => {
                const obj = {
                    identityKey: new Uint8Array(0),
                    identitySig: new Uint8Array(0)
                };
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            obj.identityKey = reader.bytes();
                            break;
                        case 2:
                            obj.identitySig = reader.bytes();
                            break;
                        case 4:
                            obj.extensions = NoiseExtensions.codec().decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    NoiseHandshakePayload.encode = (obj) => {
        return encodeMessage(obj, NoiseHandshakePayload.codec());
    };
    NoiseHandshakePayload.decode = (buf) => {
        return decodeMessage(buf, NoiseHandshakePayload.codec());
    };
})(NoiseHandshakePayload || (NoiseHandshakePayload = {}));
//# sourceMappingURL=payload.js.map