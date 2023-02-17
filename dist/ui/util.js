"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLatestOpniz = exports.isLatestCore = exports.isLatestLibraries = exports.arduinoCliExec = exports.promiseExec = exports.spinnerWrap = exports.retryArduinoCli = exports.zxFormat = void 0;
require("zx/globals");
const ora_1 = __importDefault(require("ora"));
const util_1 = __importDefault(require("util"));
const child_process_1 = require("child_process");
const config_js_1 = require("../config.js");
const zxFormat = (templateStrings) => [templateStrings];
exports.zxFormat = zxFormat;
const retryArduinoCli = (command, max) => __awaiter(void 0, void 0, void 0, function* () {
    let count = 0;
    while (count < max) {
        if (count > 0)
            console.log("retry:", count, command); // debug:
        count++;
        try {
            const result = yield (0, exports.arduinoCliExec)(command);
            if (!result.stderr)
                return result.stdout;
        }
        catch (e) {
            console.error(e);
            yield sleep(100);
        }
    }
    throw new Error(`retryArduinoCli: \`${command}\` failed after ${max} retries`);
});
exports.retryArduinoCli = retryArduinoCli;
const spinnerWrap = (text, func, stopType = "stop") => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(text).start();
    try {
        const result = yield func();
        spinner[stopType]();
        return result;
    }
    catch (e) {
        spinner.fail();
        throw e;
    }
});
exports.spinnerWrap = spinnerWrap;
exports.promiseExec = util_1.default.promisify(child_process_1.exec);
const arduinoCliExec = (command) => (0, exports.promiseExec)(`${path.normalize(config_js_1.arduinoCliPath)} ${command}`);
exports.arduinoCliExec = arduinoCliExec;
const isLatestLibraries = (libraries) => __awaiter(void 0, void 0, void 0, function* () {
    const list = (yield (0, exports.arduinoCliExec)(`lib list`)).stdout;
    return libraries.split(" ")
        .map(lib => !!(list.replace(/ +/g, "@").match(lib)))
        .every(matched => matched);
});
exports.isLatestLibraries = isLatestLibraries;
const isLatestCore = () => __awaiter(void 0, void 0, void 0, function* () {
    const list = (yield (0, exports.arduinoCliExec)(`core list`)).stdout;
    return !!(list.replace(/ +/g, "@").match(config_js_1.core));
});
exports.isLatestCore = isLatestCore;
const isLatestOpniz = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const githubApiUrl = repo.replace("github.com/", "api.github.com/repos/") + "/tags";
    const latestVersion = (yield (yield fetch(githubApiUrl)).json())[0].name;
    const opnizType = (_a = repo.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split("-").pop();
    const opnizLibrary = opnizType + latestVersion.replace("v", "@");
    const list = (yield (0, exports.arduinoCliExec)(`lib list`)).stdout;
    return !!(list.replace(/ +/g, "@").match(opnizLibrary));
});
exports.isLatestOpniz = isLatestOpniz;
