"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const utils_1 = require("../utils");
/**
 * Loads and parses configuration from command arguments
 * @param transformer
 */
function default_1(prefix) {
    const config = minimist(process.argv.slice(2))[prefix];
    utils_1.walkObject(config, (value, key, parent) => {
        if (parent && key)
            parent[key] = utils_1.parseStringValue(value);
    });
    return config;
}
exports.default = default_1;
//# sourceMappingURL=arguments.js.map