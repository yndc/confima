"use strict";
/**
 * Confima
 *
 * Configuration loader, merger, and validator.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
const utils_1 = require("./utils");
const file_1 = require("./loaders/file");
const environment_1 = require("./loaders/environment");
const arguments_1 = require("./loaders/arguments");
/**
 * Returns the configuration loader builder
 * @param configFilePath
 */
function default_1() {
    let tempConfig = [];
    let state = undefined;
    let validator = undefined;
    let onError = (e) => console.error(e);
    function updateState(changes) {
        const newState = utils_1.deepMerge(changes, state ? state : {});
        if (validator && validator(newState) === false) {
            if (state) {
                if (validator.errors)
                    onError(validator.errors);
            }
            else
                throw validator.errors;
        }
        else
            state = newState;
    }
    return {
        /**
         * Sets the schema for the final configuration
         *
         * If this is set, then the final configuration will be validated against this schema.
         * On failure, exception will be thrown with the errors
         */
        setSchema: function (schema) {
            validator = new ajv().compile(schema);
            return this;
        },
        /**
         * Adds a plain object to the configuration load queue
         */
        fromObject: function (object) {
            tempConfig.push(object);
            return this;
        },
        /**
         * Adds a file to the configuration load queue
         */
        fromFile: function (filePath, options = { watch: false }) {
            const { watch, args } = options;
            tempConfig.push(file_1.default(filePath, args, watch ? o => updateState(o) : undefined));
            return this;
        },
        /**
         * Adds a job to load configuration from the environment variables with the given variable prefix
         */
        fromEnvironment: function (prefix = "APP_", options = { watch: false }) {
            const { watch = false } = options;
            tempConfig.push(environment_1.default(prefix));
            return this;
        },
        /**
         * Adds a job to load configuration from the command arguments with the given argument prefix
         */
        fromArgument: function (prefix = "config") {
            tempConfig.push(arguments_1.default(prefix));
            return this;
        },
        /**
         * Retrieves the configuration as plain object
         */
        get: function () {
            if (!state) {
                updateState(tempConfig);
            }
            return state;
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map