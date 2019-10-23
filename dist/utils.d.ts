/**
 * Deeply merges a list of source objects into the target.
 * Please note that the target object will be mutated.
 * @param to
 * @param from
 */
export declare function deepMerge(sources: object[], target?: object): any;
/**
 * Set a deeply nested object property from an object path string
 * { } + hey.how.are+ "you" = { hey: { how: { are: "you"}}}
 *
 * @param source
 */
export declare function setObjectValue(obj: object, pathStr: string, value: any, delimiter?: string): void;
/**
 * Get file extension in an arbitary path, dot (.) not included
 * @param str
 */
export declare function getExtension(str: string): string;
/**
 * Parses a string value to their represented real value
 * @param str
 */
export declare function parseStringValue(str: string): any;
/**
 * Recursively walks over an object
 * @param obj
 * @param handler
 */
export declare function walkObject(obj: object, handler: (value: any, key?: string, parent?: object, objectPath?: string) => void): void;
