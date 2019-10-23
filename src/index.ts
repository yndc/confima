/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */

import * as fs from "fs"
import * as jsonc from "jsonc-parser"
import * as yaml from "js-yaml"
import * as toml from "toml"
import * as minimist from "minimist"
import * as ajv from "ajv"
import * as path from "path"
import {
  deepMerge,
  setObjectValue,
  getExtension,
  parseStringValue,
  walkObject
} from "./utils"
import { JSONSchema7 as JsonSchema } from "json-schema"

/**
 * Returns the configuration loader builder
 * @param configFilePath
 */
export default function<T extends object>() {
  let schema: JsonSchema | undefined = undefined
  let loadJobs: (() => object)[] = []

  return {
    /**
     * Sets the schema for the final configuration
     *
     * If this is set, then the final configuration will be validated against this schema.
     * On failure, exception will be thrown with the errors
     */
    schema: function(newSchema: JsonSchema) {
      schema = newSchema
      return this
    },
    /**
     * Adds a plain object to the configuration load queue
     */
    object: function(object: object) {
      loadJobs.push(() => object)
      return this
    },
    /**
     * Adds a file to the configuration load queue
     */
    file: function(filePath: string, args?: any[]) {
      loadJobs.push(() => loadFromFile(filePath, args))
      return this
    },
    /**
     * Adds a job to load configuration from the environment variables with the given variable prefix
     */
    environment: function(prefix: string = "APP_") {
      loadJobs.push(() => loadFromEnvironment(prefix))
      return this
    },
    /**
     * Adds a job to load configuration from the command arguments with the given argument prefix
     */
    argument: function(prefix: string = "config") {
      loadJobs.push(() => loadFromArguments(prefix))
      return this
    },
    /**
     * Loads the configuration
     */
    load: function() {
      const result = deepMerge(loadJobs.map(job => job()), {})
      if (schema) {
        const validator = new ajv()
        if (!validator.validate(schema, result)) {
          throw validator.errors
        }
      }
      return result as T
    }
  }
}

/**
 * Loads and parses configuration objest from file path
 * @param filePath
 */
function loadFromFile(filePath: string, jsFileArgs?: any[]): object {
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
  switch (extension) {
    case "json":
      return JSON.parse(fs.readFileSync(resolvedPath).toString())
    case "jsonc":
      return jsonc.parse(fs.readFileSync(resolvedPath).toString())
    case "js": {
      const cfg = require(resolvedPath)
      if (typeof cfg === "function")
        return cfg(...(jsFileArgs ? jsFileArgs : []))
      return cfg
    }
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
function loadFromArguments(prefix: string) {
  const config = minimist(process.argv.slice(2))[prefix]
  walkObject(config, (value, key, parent) => {
    if (parent && key) parent[key] = parseStringValue(value)
  })
  return config
}

/**
 * Loads and parses configuration from environment variables
 * @param transformer
 */
function loadFromEnvironment(prefix: string) {
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
