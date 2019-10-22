/**
 * Deeply merges a list of source objects into the target.
 * Please note that the target object will be mutated.
 * @param to
 * @param from
 */
export function deepMerge(
  sources: object[],
  target: object = {},
  options?: {
    /**
     * Overwrite sources to target properties.
     * If disabled, existing non-object properties will remain.
     * @default true
     */
    overwrite?: boolean;
  }
) {
  const merge = (from, to) => {
    for (var key in from) {
      if (typeof from[key] !== "object" || !from[key]) {
        to[key] = from[key];
      } else if (Array.isArray(from[key])) {
        if (Array.isArray(to[key]))
          Array.prototype.push.apply(to[key], from[key]);
        else {
          to[key] = from[key];
        }
      } else {
        to[key] = merge(from[key], to[key] || {});
      }
    }
    return to;
  };
  return sources.reduce((r, x) => {
    return merge(x, r);
  }, target);
}

/**
 * Set a deeply nested object property from an object path string
 * { } + hey.how.are+ "you" = { hey: { how: { are: "you"}}}
 * @param source
 */
export function setObjectValue(obj: object, pathStr: string, value: any, delimiter: string = ".") {
  const steps = pathStr.split(delimiter);
  let pointer = obj;
  while (steps.length > 1) {
    const step = steps.shift();
    if (step) {
      if (!pointer.hasOwnProperty(step)) pointer[step] = {};
      pointer = pointer[step];
    }
  }
  const propName = steps.shift();
  if (!propName) return;
  pointer[propName] = value;
}

/**
 * Get file extension in an arbitary path, dot (.) not included
 * @param str
 */
export function getExtension(str: string): string {
  const splitted = str.split('.')
  if (splitted.length <= 1) return ''
  if (splitted[splitted.length - 1].includes('/')) return ''
  return splitted[splitted.length - 1]
}