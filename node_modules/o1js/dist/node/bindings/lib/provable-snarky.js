// TODO make this whole file reuse ./provable-generic.ts
// external API
export { provable, provablePure };
// internal API
export { HashInput, };
let complexTypes = new Set(['object', 'function']);
const HashInput = {
    get empty() {
        return {};
    },
    append(input1, input2) {
        return {
            fields: (input1.fields ?? []).concat(input2.fields ?? []),
            packed: (input1.packed ?? []).concat(input2.packed ?? []),
        };
    },
};
function provable(typeObj, options) {
    let objectKeys = typeof typeObj === 'object' && typeObj !== null
        ? options?.customObjectKeys ?? Object.keys(typeObj).sort()
        : [];
    let nonCircuitPrimitives = new Set([
        Number,
        String,
        Boolean,
        BigInt,
        null,
        undefined,
    ]);
    if (!nonCircuitPrimitives.has(typeObj) &&
        !complexTypes.has(typeof typeObj)) {
        throw Error(`provable: unsupported type "${typeObj}"`);
    }
    function sizeInFields(typeObj) {
        if (nonCircuitPrimitives.has(typeObj))
            return 0;
        if (Array.isArray(typeObj))
            return typeObj.map(sizeInFields).reduce((a, b) => a + b, 0);
        if ('sizeInFields' in typeObj)
            return typeObj.sizeInFields();
        return Object.values(typeObj)
            .map(sizeInFields)
            .reduce((a, b) => a + b, 0);
    }
    function toFields(typeObj, obj, isToplevel = false) {
        if (nonCircuitPrimitives.has(typeObj))
            return [];
        if (!complexTypes.has(typeof typeObj) || typeObj === null)
            return [];
        if (Array.isArray(typeObj))
            return typeObj.map((t, i) => toFields(t, obj[i])).flat();
        if ('toFields' in typeObj)
            return typeObj.toFields(obj);
        return (isToplevel ? objectKeys : Object.keys(typeObj).sort())
            .map((k) => toFields(typeObj[k], obj[k]))
            .flat();
    }
    function toAuxiliary(typeObj, obj, isToplevel = false) {
        if (typeObj === Number)
            return [obj ?? 0];
        if (typeObj === String)
            return [obj ?? ''];
        if (typeObj === Boolean)
            return [obj ?? false];
        if (typeObj === BigInt)
            return [obj ?? 0n];
        if (typeObj === undefined || typeObj === null)
            return [];
        if (Array.isArray(typeObj))
            return typeObj.map((t, i) => toAuxiliary(t, obj?.[i]));
        if ('toAuxiliary' in typeObj)
            return typeObj.toAuxiliary(obj);
        return (isToplevel ? objectKeys : Object.keys(typeObj).sort()).map((k) => toAuxiliary(typeObj[k], obj?.[k]));
    }
    function toInput(typeObj, obj, isToplevel = false) {
        if (nonCircuitPrimitives.has(typeObj))
            return {};
        if (Array.isArray(typeObj)) {
            return typeObj
                .map((t, i) => toInput(t, obj[i]))
                .reduce(HashInput.append, HashInput.empty);
        }
        if ('toInput' in typeObj)
            return typeObj.toInput(obj);
        if ('toFields' in typeObj) {
            return { fields: typeObj.toFields(obj) };
        }
        return (isToplevel ? objectKeys : Object.keys(typeObj).sort())
            .map((k) => toInput(typeObj[k], obj[k]))
            .reduce(HashInput.append, HashInput.empty);
    }
    function toJSON(typeObj, obj, isToplevel = false) {
        if (typeObj === BigInt)
            return obj.toString();
        if (typeObj === String || typeObj === Number || typeObj === Boolean)
            return obj;
        if (typeObj === undefined || typeObj === null)
            return null;
        if (!complexTypes.has(typeof typeObj) || typeObj === null)
            return obj ?? null;
        if (Array.isArray(typeObj))
            return typeObj.map((t, i) => toJSON(t, obj[i]));
        if ('toJSON' in typeObj)
            return typeObj.toJSON(obj);
        return Object.fromEntries((isToplevel ? objectKeys : Object.keys(typeObj).sort()).map((k) => [
            k,
            toJSON(typeObj[k], obj[k]),
        ]));
    }
    function fromFields(typeObj, fields, aux = [], isToplevel = false) {
        if (typeObj === Number ||
            typeObj === String ||
            typeObj === Boolean ||
            typeObj === BigInt)
            return aux[0];
        if (typeObj === undefined || typeObj === null)
            return typeObj;
        if (!complexTypes.has(typeof typeObj) || typeObj === null)
            return null;
        if (Array.isArray(typeObj)) {
            let array = [];
            let i = 0;
            let offset = 0;
            for (let subObj of typeObj) {
                let size = sizeInFields(subObj);
                array.push(fromFields(subObj, fields.slice(offset, offset + size), aux[i]));
                offset += size;
                i++;
            }
            return array;
        }
        if ('fromFields' in typeObj)
            return typeObj.fromFields(fields, aux);
        let keys = isToplevel ? objectKeys : Object.keys(typeObj).sort();
        let values = fromFields(keys.map((k) => typeObj[k]), fields, aux);
        return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }
    function fromJSON(typeObj, json, isToplevel = false) {
        if (typeObj === BigInt)
            return BigInt(json);
        if (typeObj === String || typeObj === Number || typeObj === Boolean)
            return json;
        if (typeObj === null)
            return undefined;
        if (!complexTypes.has(typeof typeObj))
            return json ?? undefined;
        if (Array.isArray(typeObj))
            return typeObj.map((t, i) => fromJSON(t, json[i]));
        if ('fromJSON' in typeObj)
            return typeObj.fromJSON(json);
        let keys = isToplevel ? objectKeys : Object.keys(typeObj).sort();
        let values = fromJSON(keys.map((k) => typeObj[k]), keys.map((k) => json[k]));
        return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }
    function check(typeObj, obj, isToplevel = false) {
        if (nonCircuitPrimitives.has(typeObj))
            return;
        if (Array.isArray(typeObj))
            return typeObj.forEach((t, i) => check(t, obj[i]));
        if ('check' in typeObj)
            return typeObj.check(obj);
        return (isToplevel ? objectKeys : Object.keys(typeObj).sort()).forEach((k) => check(typeObj[k], obj[k]));
    }
    if (options?.isPure === true) {
        return {
            sizeInFields: () => sizeInFields(typeObj),
            toFields: (obj) => toFields(typeObj, obj, true),
            toAuxiliary: () => [],
            fromFields: (fields) => fromFields(typeObj, fields, [], true),
            toInput: (obj) => toInput(typeObj, obj, true),
            toJSON: (obj) => toJSON(typeObj, obj, true),
            fromJSON: (json) => fromJSON(typeObj, json, true),
            check: (obj) => check(typeObj, obj, true),
        };
    }
    return {
        sizeInFields: () => sizeInFields(typeObj),
        toFields: (obj) => toFields(typeObj, obj, true),
        toAuxiliary: (obj) => toAuxiliary(typeObj, obj, true),
        fromFields: (fields, aux) => fromFields(typeObj, fields, aux, true),
        toInput: (obj) => toInput(typeObj, obj, true),
        toJSON: (obj) => toJSON(typeObj, obj, true),
        fromJSON: (json) => fromJSON(typeObj, json, true),
        check: (obj) => check(typeObj, obj, true),
    };
}
function provablePure(typeObj, options = {}) {
    return provable(typeObj, { ...options, isPure: true });
}
//# sourceMappingURL=provable-snarky.js.map