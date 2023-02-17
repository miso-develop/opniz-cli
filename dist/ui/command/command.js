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
Object.defineProperty(exports, "__esModule", { value: true });
exports.arduino = exports.monitor = exports.list = exports.upload = exports.init = void 0;
require("zx/globals");
const util_js_1 = require("../util.js");
const init_js_1 = require("./init.js");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return init_js_1.init; } });
const upload_js_1 = require("./upload.js");
Object.defineProperty(exports, "upload", { enumerable: true, get: function () { return upload_js_1.upload; } });
const config_js_1 = require("../../config.js");
$.verbose = false;
process.chdir(__dirname + "/../../../");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, util_js_1.spinnerWrap)("Loading board list", () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${config_js_1.arduinoCliPath} board list`).stdout.replace(/(\n\n)+/, "");
    }));
    console.log(result);
});
exports.list = list;
const monitor = (devicePort) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield $ `${config_js_1.arduinoCliPath} monitor --port ${devicePort} --config baudrate=115200`.pipe(process.stdout);
    }
    catch (e) {
        // console.log(e.message)
    }
});
exports.monitor = monitor;
const arduino = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = `${config_js_1.arduinoCliPath} ${options}`;
        const pieces = [command];
        yield $(pieces).pipe(process.stdout);
    }
    catch (e) {
        // console.log(e.message)
    }
});
exports.arduino = arduino;
