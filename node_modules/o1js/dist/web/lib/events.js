import { prefixes } from '../bindings/crypto/constants.js';
import { prefixToField } from '../bindings/lib/binable.js';
export { createEvents, dataAsHash };
function createEvents({ Field, Poseidon, }) {
    // hashing helpers
    function initialState() {
        return [Field(0), Field(0), Field(0)];
    }
    function salt(prefix) {
        return Poseidon.update(initialState(), [prefixToField(Field, prefix)]);
    }
    function hashWithPrefix(prefix, input) {
        let init = salt(prefix);
        return Poseidon.update(init, input)[0];
    }
    function emptyHashWithPrefix(prefix) {
        return salt(prefix)[0];
    }
    const Events = {
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappEventsEmpty');
            return { hash, data: [] };
        },
        pushEvent(events, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.events, [events.hash, eventHash]);
            return { hash, data: [event, ...events.data] };
        },
        fromList(events) {
            return [...events].reverse().reduce(Events.pushEvent, Events.empty());
        },
        hash(events) {
            return Events.fromList(events).hash;
        },
    };
    const EventsProvable = {
        ...Events,
        ...dataAsHash({
            emptyValue: Events.empty,
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = Events.hash(data);
                return { data, hash };
            },
        }),
    };
    const Actions = {
        // same as events but w/ different hash prefixes
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappActionsEmpty');
            return { hash, data: [] };
        },
        pushEvent(actions, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.sequenceEvents, [
                actions.hash,
                eventHash,
            ]);
            return { hash, data: [event, ...actions.data] };
        },
        fromList(events) {
            return [...events].reverse().reduce(Actions.pushEvent, Actions.empty());
        },
        hash(events) {
            return this.fromList(events).hash;
        },
        // different than events
        emptyActionState() {
            return emptyHashWithPrefix('MinaZkappActionStateEmptyElt');
        },
        updateSequenceState(state, sequenceEventsHash) {
            return hashWithPrefix(prefixes.sequenceEvents, [
                state,
                sequenceEventsHash,
            ]);
        },
    };
    const SequenceEventsProvable = {
        ...Actions,
        ...dataAsHash({
            emptyValue: Actions.empty,
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = Actions.hash(data);
                return { data, hash };
            },
        }),
    };
    return { Events: EventsProvable, Actions: SequenceEventsProvable };
}
function dataAsHash({ emptyValue, toJSON, fromJSON, }) {
    return {
        emptyValue,
        sizeInFields() {
            return 1;
        },
        toFields({ hash }) {
            return [hash];
        },
        toAuxiliary(value) {
            return [value?.data ?? emptyValue().data];
        },
        fromFields([hash], [data]) {
            return { data, hash };
        },
        toJSON({ data }) {
            return toJSON(data);
        },
        fromJSON(json) {
            return fromJSON(json);
        },
        check() { },
        toInput({ hash }) {
            return { fields: [hash] };
        },
    };
}
//# sourceMappingURL=events.js.map