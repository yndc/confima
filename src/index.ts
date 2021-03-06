/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */

import * as ajv from "ajv"
import { deepMerge } from "./utils"
import fileLoader from "./loaders/file"
import environmentLoader from "./loaders/environment"
import argumentLoader from "./loaders/arguments"

/**
 * Interface for the config builder
 */
export interface ConfigBuilder<T extends object> {
  setSchema: (schema: object, options?: ajv.Options) => ConfigBuilder<T>
  fromObject: (object: object) => ConfigBuilder<T>
  fromFile: (
    filePath: string,
    options?: { watch: boolean; args: any[] }
  ) => ConfigBuilder<T>
  fromEnvironment: (
    prefix?: string,
    options?: { watch: boolean }
  ) => ConfigBuilder<T>
  fromArgument: (prefix?: string) => ConfigBuilder<T>
  build: () => ConfigWrapper<T>
}

/**
 * Interface for the config object wrapper
 */
export interface ConfigWrapper<T extends object> {
  /**`
   * Retrieves the config values in plain object
   */
  value: () => T
}

/**
 * Returns the configuration loader builder
 * @param configFilePath
 */
export default function<T extends object>(): ConfigBuilder<T> {
  let tempConfig: object[] = []
  let state: T | undefined = undefined
  let validator: ajv.ValidateFunction | undefined = undefined
  let onError = (e: ajv.ErrorObject[]) => console.error(e)
  function updateState(changes: object[]) {
    const newState = deepMerge(changes, state ? state : {})
    if (validator && validator(newState) === false) {
      if (state) {
        if (validator.errors) onError(validator.errors)
      } else throw validator.errors
    } else state = newState
  }

  return {
    /**
     * Sets the schema for the final configuration
     *
     * If this is set, then the final configuration will be validated against this schema.
     * On failure, exception will be thrown with the errors
     */
    setSchema: function(schema: object, options?: ajv.Options) {
      validator = new ajv(options).compile(schema)
      return this
    },
    /**
     * Adds a plain object to the configuration load queue
     */
    fromObject: function(object: object) {
      tempConfig.push(object)
      return this
    },
    /**
     * Adds a file to the configuration load queue
     */
    fromFile: function(
      filePath: string,
      options: { watch?: boolean; args?: any[] } = { watch: false }
    ) {
      const { watch, args } = options
      tempConfig.push(
        fileLoader(filePath, args, watch ? o => updateState(o) : undefined)
      )
      return this
    },
    /**
     * Adds a job to load configuration from the environment variables with the given variable prefix
     */
    fromEnvironment: function(
      prefix: string = "APP_",
      options: { watch: boolean } = { watch: false }
    ) {
      const { watch = false } = options
      tempConfig.push(environmentLoader(prefix))
      return this
    },
    /**
     * Adds a job to load configuration from the command arguments with the given argument prefix
     */
    fromArgument: function(prefix: string = "config") {
      tempConfig.push(argumentLoader(prefix))
      return this
    },
    /**
     * Retrieves the configuration as plain object
     */
    build: function() {
      if (!state) {
        updateState(tempConfig)
      }
      if (state)
        return {
          value: () => state as T
        }
      else throw "Empty configuration"
    }
  }
}
