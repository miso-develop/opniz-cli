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
exports.spinnerWrap = exports.retryCommand = exports.zxFormat = void 0;
const ora_1 = __importDefault(require("ora"));
const zxFormat = (templateStrings) => [templateStrings];
exports.zxFormat = zxFormat;
const retryCommand = (command, max) => __awaiter(void 0, void 0, void 0, function* () {
    const pieces = (0, exports.zxFormat)(command);
    let count = 0;
    while (count < max) {
        if (count > 0)
            console.log("retry:", count, command); // debug:
        count++;
        try {
            const result = yield $(pieces);
            if (result.exitCode === 0)
                return result.stdout;
        }
        catch (e) {
            console.error(e);
        }
    }
    throw new Error(`retryCommand: \`${command}\` failed after ${max} retries`);
});
exports.retryCommand = retryCommand;
const spinnerWrap = (text, func, stopType = "stop") => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(text).start();
    try {
        const result = yield func();
        if (result)
            console.log(result.replace(/(\n\n)+/, ""));
        spinner[stopType]();
    }
    catch (e) {
        spinner.fail();
        throw e;
    }
});
exports.spinnerWrap = spinnerWrap;
