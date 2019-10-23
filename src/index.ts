/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */

import * as ajv from "ajv"
import { deepMerge } from "./utils"
import { JSONSchema7 as JsonSchema } from "json-schema"
import fileLoader from "./loaders/file"
import environmentLoader from "./loaders/environment"
import argumentLoader from "./loaders/arguments"

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
      loadJobs.push(() => fileLoader(filePath, args))
      return this
    },
    /**
     * Adds a job to load configuration from the environment variables with the given variable prefix
     */
    environment: function(prefix: string = "APP_") {
      loadJobs.push(() => environmentLoader(prefix))
      return this
    },
    /**
     * Adds a job to load configuration from the command arguments with the given argument prefix
     */
    argument: function(prefix: string = "config") {
      loadJobs.push(() => argumentLoader(prefix))
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
