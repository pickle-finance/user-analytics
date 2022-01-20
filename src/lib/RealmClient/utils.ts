import { EJSON } from "bson";

const SERIALIZATION_OPTIONS = {
    relaxed: false, // Ensure Canonical mode
};

/**
 * Serialize an object containing BSON types into extended-JSON.
 *
 * @param obj The object containing BSON types.
 * @returns The document in extended-JSON format.
 */
export function serialize<Obj extends object>(obj: Obj): object {
    return EJSON.serialize(obj, SERIALIZATION_OPTIONS);
}

/**
 * De-serialize an object or an array of object from extended-JSON into an object or an array of object with BSON types.
 *
 * @param obj The object or array of objects in extended-JSON format.
 * @returns The object or array of objects with inflated BSON types.
 */
export function deserialize<Obj extends object>(obj: object | object[]): Obj {
    if (Array.isArray(obj)) {
        return obj.map(doc => EJSON.deserialize(doc)) as Obj;
    } else {
        return EJSON.deserialize(obj) as Obj;
    }
}

/**
 * Remove the key for any fields with undefined values.
 *
 * @param args The arguments to clean.
 * @returns The cleaned arguments.
 */
export function cleanArgs(args: any[]) {
    for (const arg of args) {
        if (typeof arg === "object") {
            for (const [key, value] of Object.entries(arg)) {
                if (value === undefined) {
                    delete arg[key];
                }
            }
        }
    }
    return args;
}

/**
 * Remove keys for any undefined values and serialize to EJSON.
 *
 * @param args The arguments to clean and serialize.
 * @returns The cleaned and serialized arguments.
 */
export function cleanArgsAndSerialize(args: any[]) {
    const cleaned = cleanArgs(args);
    return cleaned.map(arg => (typeof arg === "object" ? serialize(arg) : arg));
}