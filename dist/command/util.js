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
exports.spinnerWrap = exports.retryCommand = void 0;
const ora_1 = __importDefault(require("ora"));
const retryCommand = (command, max) => __awaiter(void 0, void 0, void 0, function* () {
    const pieces = [command];
    let count = 0;
    while (count < max) {
        if (count > 0)
            console.log("retry:", count, command); // debug:
        count++;
        if ((yield $(pieces).exitCode) === 0)
            return;
    }
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
