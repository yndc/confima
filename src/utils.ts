/**
 * Deeply merges a list of source objects into the target.
 * Please note that the target object will be mutated.
 * @param to
 * @param from
 */
export function deepMerge(sources: object[], target: object = {}) {
  const merge = (from, to) => {
    for (var key in from) {
      if (typeof from[key] !== "object" || !from[key]) {
        to[key] = from[key]
      } else if (Array.isArray(from[key])) {
        if (Array.isArray(to[key]))
          Array.prototype.push.apply(to[key], from[key])
        else {
          to[key] = from[key]
        }
      } else {
        to[key] = merge(from[key], to[key] || {})
      }
    }
    return to
  }
  return sources.reduce((r, x) => {
    return merge(x, r)
  }, target)
}

/**
 * Set a deeply nested object property from an object path string
 * { } + hey.how.are+ "you" = { hey: { how: { are: "you"}}}
 *
 * @param source
 */
export function setObjectValue(
  obj: object,
  pathStr: string,
  value: any,
  delimiter: string = "."
) {
  const steps = pathStr.split(delimiter)
  let pointer = obj
  while (steps.length > 1) {
    const step = steps.shift()
    if (step) {
      if (!pointer.hasOwnProperty(step)) pointer[step] = {}
      pointer = pointer[step]
    }
  }
  const propName = steps.shift()
  if (!propName) return
  pointer[propName] = value
}

/**
 * Get file extension in an arbitary path, dot (.) not included
 * @param str
 */
export function getExtension(str: string): string {
  const splitted = str.split(".")
  if (splitted.length <= 1) return ""
  if (splitted[splitted.length - 1].includes("/")) return ""
  return splitted[splitted.length - 1]
}

/**
 * Parses a string value to their represented real value
 * @param str
 */
export function parseStringValue(str: string): any {
  if (str === "undefined") return undefined
  if (str === "null") return null
  if (str === "true") return true
  if (str === "false") return false
  if (!isNaN((str as unknown) as number)) return +((str as unknown) as number)
  if (
    (str.startsWith("{") && str.endsWith("}")) ||
    (str.startsWith("[") && str.endsWith("]"))
  )
    return str
      .slice(1, -1)
      .split(",")
      .map(x => parseStringValue(x.trim()))
  return str
}

/**
 * Recursively walks over an object
 * @param obj
 * @param handler
 */
export function walkObject(
  obj: object,
  handler: (
    value: any,
    key?: string,
    parent?: object,
    objectPath?: string
  ) => void
) {
  const walk = (
    o: object,
    key?: string,
    parent?: object,
    objectPath?: string
  ) => {
    if (typeof o !== "object") handler(o, key, parent, objectPath)
    else {
      for (let k in o) {
        walk(o[k], k, o, objectPath ? k : objectPath + "." + k)
      }
    }
  }
  walk(obj)
}
