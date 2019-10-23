"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * Loads and parses configuration from environment variables
 * @param transformer
 */
function default_1(prefix) {
    let result = {};
    const environmentVariables = process.env;
    const appVariables = Object.keys(environmentVariables).reduce((r, name) => {
        if (!name.startsWith(prefix))
            return r;
        const varName = name.replace(prefix, "").replace(/__/g, ".");
        return Object.assign(Object.assign({}, r), { [varName]: environmentVariables[name] });
    }, {});
    Object.keys(appVariables).forEach(key => {
        let value = utils_1.parseStringValue(appVariables[key]);
        utils_1.setObjectValue(result, key, value);
    });
    return result;
}
exports.default = default_1;
//# sourceMappingURL=environment.js.map