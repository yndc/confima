import { parseStringValue, setObjectValue } from "~/utils"

/**
 * Loads and parses configuration from environment variables
 * @param transformer
 */
export default function(prefix: string) {
  let result: object = {}
  const environmentVariables = process.env
  const appVariables = Object.keys(environmentVariables).reduce((r, name) => {
    if (!name.startsWith(prefix)) return r
    const varName = name.replace(prefix, "").replace(/__/g, ".")
    return {
      ...r,
      [varName]: environmentVariables[name]
    }
  }, {})
  Object.keys(appVariables).forEach(key => {
    let value = parseStringValue(appVariables[key])
    setObjectValue(result, key, value)
  })
  return result
}
