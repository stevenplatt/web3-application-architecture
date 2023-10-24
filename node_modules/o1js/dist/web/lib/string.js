import { __decorate, __metadata } from "tslib";
import { Bool, Field } from '../lib/core.js';
import { arrayProp, CircuitValue, prop } from './circuit_value.js';
import { Provable } from './provable.js';
import { Poseidon } from './hash.js';
export { Character, CircuitString };
const DEFAULT_STRING_LENGTH = 128;
class Character extends CircuitValue {
    isNull() {
        return this.equals(NullCharacter());
    }
    toField() {
        return this.value;
    }
    toString() {
        const charCode = Number(this.value.toString());
        return String.fromCharCode(charCode);
    }
    static fromString(str) {
        const char = Field(str.charCodeAt(0));
        return new Character(char);
    }
    // TODO: Add support for more character sets
    // right now it's 16 bits because 8 not supported :/
    static check(c) {
        c.value.rangeCheckHelper(16).assertEquals(c.value);
    }
}
__decorate([
    prop,
    __metadata("design:type", Field)
], Character.prototype, "value", void 0);
class CircuitString extends CircuitValue {
    // constructor is private because
    // * we do not want extra logic inside CircuitValue constructors, as a general pattern (to be able to create them generically)
    // * here, not running extra logic to fill up the characters would be wrong
    constructor(values) {
        super(values);
    }
    // this is the publicly accessible constructor
    static fromCharacters(chars) {
        return new CircuitString(fillWithNull(chars, this.maxLength));
    }
    maxLength() {
        return this.constructor.maxLength;
    }
    // some O(n) computation that should be only done once in the circuit
    computeLengthAndMask() {
        let n = this.values.length;
        // length is the actual, dynamic length
        let length = Field(0);
        // mask is an array that is true where `this` has its first null character, false elsewhere
        let mask = [];
        let wasntNullAlready = Bool(true);
        for (let i = 0; i < n; i++) {
            let isNull = this.values[i].isNull();
            mask[i] = isNull.and(wasntNullAlready);
            wasntNullAlready = isNull.not().and(wasntNullAlready);
            length.add(wasntNullAlready.toField());
        }
        // mask has length n+1, the last element is true when `this` has no null char
        mask[n] = wasntNullAlready;
        this._length = length;
        this._mask = mask;
        return { mask, length };
    }
    lengthMask() {
        return this._mask ?? this.computeLengthAndMask().mask;
    }
    length() {
        return this._length ?? this.computeLengthAndMask().length;
    }
    /**
     * appends another string to this one, returns the result and proves that it fits
     * within the `maxLength` of this string (the other string can have a different maxLength)
     */
    append(str) {
        let n = this.maxLength();
        // only allow append if the dynamic length does not overflow
        this.length().add(str.length()).assertLessThan(n);
        let chars = this.values;
        let otherChars = fillWithNull(str.values, n);
        // compute the concatenated string -- for *each* of the possible lengths of the first string
        let possibleResults = [];
        for (let length = 0; length < n + 1; length++) {
            // if the first string has this `length`, then this is the result:
            possibleResults[length] = chars
                .slice(0, length)
                .concat(otherChars.slice(0, n - length));
        }
        // compute the actual result, by always picking the char which correponds to the actual length
        let result = [];
        let mask = this.lengthMask();
        for (let i = 0; i < n; i++) {
            let possibleCharsAtI = possibleResults.map((r) => r[i]);
            result[i] = Provable.switch(mask, Character, possibleCharsAtI);
        }
        return CircuitString.fromCharacters(result);
    }
    // TODO
    /**
     * returns true if `str` is found in this `CircuitString`
     */
    // contains(str: CircuitString): Bool {
    //   // only succeed if the dynamic length is smaller
    //   let otherLength = str.length();
    //   otherLength.assertLessThan(this.length());
    // }
    hash() {
        return Poseidon.hash(this.values.map((x) => x.value));
    }
    substring(start, end) {
        return CircuitString.fromCharacters(this.values.slice(start, end));
    }
    toString() {
        return this.values
            .map((x) => x.toString())
            .join('')
            .replace(/[^ -~]+/g, '');
    }
    static fromString(str) {
        if (str.length > this.maxLength) {
            throw Error('CircuitString.fromString: input string exceeds max length!');
        }
        let characters = str.split('').map((x) => Character.fromString(x));
        return CircuitString.fromCharacters(characters);
    }
}
CircuitString.maxLength = DEFAULT_STRING_LENGTH;
__decorate([
    arrayProp(Character, DEFAULT_STRING_LENGTH),
    __metadata("design:type", Array)
], CircuitString.prototype, "values", void 0);
// TODO
// class CircuitString8 extends CircuitString {
//   static maxLength = 8;
//   @arrayProp(Character, 8) values: Character[] = [];
// }
// note: this used to be a custom class, which doesn't work
// NullCharacter must use the same circuits as normal Characters
let NullCharacter = () => new Character(Field(0));
function fillWithNull([...values], length) {
    let nullChar = NullCharacter();
    for (let i = values.length; i < length; i++) {
        values[i] = nullChar;
    }
    return values;
}
//# sourceMappingURL=string.js.map