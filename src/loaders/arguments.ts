import * as minimist from "minimist"
import { parseStringValue, walkObject } from "../utils"

/**
 * Loads and parses configuration from command arguments
 * @param transformer
 */
export default function(prefix: string) {
  const config = minimist(process.argv.slice(2))[prefix]
  walkObject(config, (value, key, parent) => {
    if (parent && key) parent[key] = parseStringValue(value)
  })
  return config
}
