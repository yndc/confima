/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */
import { JSONSchema7 as JsonSchema } from "json-schema";
/**
 * Returns the configuration loader builder
 * @param configFilePath
 */
export default function <T extends object>(): {
    /**
     * Sets the schema for the final configuration
     *
     * If this is set, then the final configuration will be validated against this schema.
     * On failure, exception will be thrown with the errors
     */
    setSchema: (schema: JsonSchema) => any;
    /**
     * Adds a plain object to the configuration load queue
     */
    fromObject: (object: object) => any;
    /**
     * Adds a file to the configuration load queue
     */
    fromFile: (filePath: string, options?: {
        watch?: boolean | undefined;
        args?: any[] | undefined;
    }) => any;
    /**
     * Adds a job to load configuration from the environment variables with the given variable prefix
     */
    fromEnvironment: (prefix?: string, options?: {
        watch: boolean;
    }) => any;
    /**
     * Adds a job to load configuration from the command arguments with the given argument prefix
     */
    fromArgument: (prefix?: string) => any;
    /**
     * Retrieves the configuration as plain object
     */
    get: () => T | undefined;
};
