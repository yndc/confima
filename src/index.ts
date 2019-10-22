/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */

import * as fs from "fs"
import * as yaml from "js-yaml"
import * as toml from "toml"
import * as minimist from "minimist"
import * as ajv from "ajv"
import * as path from "path"
import { deepMerge, setObjectValue, getExtension } from "./utils"
import { JSONSchema7 as JsonSchema } from "json-schema"

/**
 * Configuration source type
 */
export enum ConfigSourceType {
  File,
  Environment,
  Argument,
  defaultValues
}

/**
 * Configuration loader options
 */
export interface ConfigLoaderOptions<T> {
  /**
   * JSON schema to validate the final configuration
   */
  schema: JsonSchema
  /**
   * List of configuration file paths to load.
   * The last file will be loaded last and will overwrite the other
   */
  files?: string[] | string
  /**
   * Order priority to load configuration from.
   * The latter (rightmost) will overwrite the former (leftmost).
   *
   * @default "[File, Environment, Argument]"
   */
  order?: ConfigSourceType[]
  /**
   * Default values for the configuration
   */
  defaultValues?: Partial<T>
  /**
   * How the environment variables name translate to the configuration structure
   * Return undefined to skip / ignore the environment variable.
   *
   * @default "APP_ prefix will be used"
   */
  environmentNameTransformer?: (string) => string | undefined
  /**
   * How the command arguments name translate to the configuration structure
   * Return undefined to skip / ignore the argument
   */
  argumentNameTransformer?: (string) => string | undefined
  /**
   * Delimiter used to target nested configuration variables
   *
   * @default "."
   */
  argumentChildDelimiter?: string
}

/**
 * Loads configuration from the given options
 * @param configFilePath
 */
export function loadConfig<T extends object>(
  options: ConfigLoaderOptions<T>
): T {
  const {
    schema,
    files = [],
    defaultValues = {},
    order = [
      ConfigSourceType.File,
      ConfigSourceType.Environment,
      ConfigSourceType.Argument
    ],
    argumentNameTransformer = (name: string) => name,
    environmentNameTransformer = (name: string) =>
      name.startsWith("APP_")
        ? name.replace("APP_", "").replace(/__/g, ".")
        : undefined,
    argumentChildDelimiter = "."
  } = options

  // Load config from the given order into an object array
  let loadedObjects: object[] = []
  while (order.length) {
    const type = order.shift()
    switch (type) {
      case ConfigSourceType.File: {
        if (!files) break
        const fileList = Array.isArray(files) ? files : [files]
        while (fileList.length) {
          const currentFile = fileList.shift()
          if (!currentFile) break
          loadedObjects.push(loadFromFile(currentFile))
        }
        break
      }
      case ConfigSourceType.Argument: {
        loadedObjects.push(
          loadFromArguments(argumentNameTransformer, argumentChildDelimiter)
        )
        break
      }
      case ConfigSourceType.Environment: {
        loadedObjects.push(loadFromEnvironment(environmentNameTransformer))
        break
      }
    }
  }

  // Deeply merge the object array into one object
  let mergedObject: object = deepMerge(loadedObjects, defaultValues)

  // Validate the merged object with the schema
  const validator = new ajv()
  if (!validator.validate(schema, mergedObject)) {
    throw validator.errors
  }

  return mergedObject as T
}

/**
 * Loads and parses configuration objest from file path
 * @param filePath
 */
function loadFromFile(filePath: string): object {
  let resolvedPath = path.resolve(filePath)
  let extension = getExtension(filePath)

  // Make sure the resolved file exists
  if (!extension) {
    if (fs.existsSync(resolvedPath + ".js")) extension = "js"
    else if (fs.existsSync(resolvedPath + ".yaml")) extension = "yaml"
    else if (fs.existsSync(resolvedPath + ".toml")) extension = "toml"
    else if (fs.existsSync(resolvedPath + ".json")) extension = "json"
    else throw `Unable to resolve the extension for: ${filePath}`
    resolvedPath = resolvedPath + "." + extension
  } else if (!fs.existsSync(resolvedPath))
    throw `File does not exists: ${filePath}`

  // Parse and return the file based on its extension
  switch (extension) {
    case "json":
      return JSON.parse(fs.readFileSync(resolvedPath).toString())
    case "js":
      return require(resolvedPath)()
    case "toml":
      return toml.parse(fs.readFileSync(resolvedPath).toString())
    case "yaml":
      return yaml.safeLoad(fs.readFileSync(resolvedPath).toString())
    default:
      throw `Unknown extension ${extension} from ${filePath}`
  }
}

/**
 * Loads and parses configuration from command arguments
 * @param transformer
 */
function loadFromArguments(
  transformer: (str: string) => string | undefined,
  delimiter: string = "."
) {
  let result: object = {}
  const args = minimist(process.argv.slice(2))
  const appVariables = Object.keys(args).reduce((r, name) => {
    const varName = transformer(name)
    if (!varName) return r
    else
      return {
        ...r,
        [varName]: args[name]
      }
  }, {})
  Object.keys(appVariables).forEach(key =>
    setObjectValue(result, key, appVariables[key], delimiter)
  )
  return result
}

/**
 * Loads and parses configuration from environment variables
 * @param transformer
 */
function loadFromEnvironment(transformer: (str: string) => string | undefined) {
  let result: object = {}
  const environmentVariables = process.env
  const appVariables = Object.keys(environmentVariables).reduce((r, name) => {
    const varName = transformer(name)
    if (!varName) return r
    else
      return {
        ...r,
        [varName]: environmentVariables[name]
      }
  }, {})
  Object.keys(appVariables).forEach(key =>
    setObjectValue(result, key, appVariables[key])
  )
  return result
}
