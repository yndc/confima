import * as path from "path"
import * as fs from "fs"
import * as yaml from "js-yaml"
import * as jsonc from "jsonc-parser"
import * as toml from "toml"
import { getExtension } from "~/utils"

/**
 * Loads and parses configuration objest from file path
 * @param filePath
 */
export default function(
  filePath: string,
  jsFileArgs?: any[],
  onChange?: (object) => void
): object {
  let resolvedPath = path.resolve(filePath)
  let extension = getExtension(filePath)

  // Make sure the resolved file exists
  if (!extension) {
    if (fs.existsSync(resolvedPath + ".js")) extension = "js"
    else if (fs.existsSync(resolvedPath + ".yaml")) extension = "yaml"
    else if (fs.existsSync(resolvedPath + ".toml")) extension = "toml"
    else if (fs.existsSync(resolvedPath + ".json")) extension = "json"
    else if (fs.existsSync(resolvedPath + ".jsonc")) extension = "jsonc"
    else throw `Unable to resolve the extension for: ${filePath}`
    resolvedPath = resolvedPath + "." + extension
  } else if (!fs.existsSync(resolvedPath))
    throw `File does not exists: ${filePath}`

  // Parse and return the file based on its extension
  const load = (() => {
    switch (extension) {
      case "json":
        return () => JSON.parse(fs.readFileSync(resolvedPath).toString())
      case "jsonc":
        return () => jsonc.parse(fs.readFileSync(resolvedPath).toString())
      case "js":
        return () => {
          const cfg = require(resolvedPath)
          if (typeof cfg === "function")
            return cfg(...(jsFileArgs ? jsFileArgs : []))
          return cfg
        }
      case "toml":
        return () => toml.parse(fs.readFileSync(resolvedPath).toString())
      case "yaml":
        return () => yaml.safeLoad(fs.readFileSync(resolvedPath).toString())
      default:
        throw `Unknown extension ${extension} from ${filePath}`
    }
  })()
  if (onChange !== undefined)
    fs.watchFile(resolvedPath, () => {
      console.log("CHANGED")
      onChange(load())
    })
  return load()
}
