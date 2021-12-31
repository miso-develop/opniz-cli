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
exports.monitor = exports.list = exports.upload = void 0;
require("zx/globals");
const ora_1 = __importDefault(require("ora"));
$.verbose = false;
process.chdir(__dirname + "/../");
const cliPath = `./arduino-cli/arduino-cli`;
const spinnerWrap = (text, func, stopType = "stop") => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(text).start();
    try {
        const result = yield func();
        spinner[stopType]();
        console.log(result);
    }
    catch (e) {
        spinner.fail();
        console.error(e.message);
    }
});
const upload = (devicePort, ssid, password, address, port, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield spinnerWrap(`Uploading opniz to port: ${devicePort}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield createSketch(ssid, password, address, port, id);
        // TODO: デバイスにより分岐
        const fqbnList = {
            m5atom: "esp32:esp32:m5stack-atom",
        };
        const fqbn = fqbnList.m5atom;
        // console.log((await $`${cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout)
        return (yield $ `${cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout;
    }), "succeed");
});
exports.upload = upload;
const createSketch = (ssid, password, address, port = "3000", id = "") => __awaiter(void 0, void 0, void 0, function* () {
    const sketchDir = "sketch";
    const sketchPath = `./${sketchDir}/${sketchDir}.ino`;
    // TODO: デバイスにより分岐
    const templateSketchList = {
        m5atom: "m5atom.ino",
        esp32: "esp32.ino",
    };
    const templateSketch = templateSketchList.m5atom;
    const templateSketchPath = `./template/${templateSketch}`;
    let sketchSource = fs.readFileSync(templateSketchPath, "utf-8");
    sketchSource = sketchSource.replace("<SSID>", ssid);
    sketchSource = sketchSource.replace("<PASSWORD>", password);
    sketchSource = sketchSource.replace("<ADDRESS>", address);
    sketchSource = sketchSource.replace("<PORT>", port);
    sketchSource = sketchSource.replace("<ID>", id);
    if (!fs.existsSync(sketchDir))
        fs.mkdirSync(sketchDir);
    fs.writeFileSync(sketchPath, sketchSource);
});
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    yield spinnerWrap("Loading board list", () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${cliPath} board list`).stdout.replace(/(\n\n)+/, "");
    }));
});
exports.list = list;
const monitor = (devicePort) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield $ `${cliPath} monitor --port ${devicePort}`.pipe(process.stdout);
    }
    catch (e) {
        // console.log(e.message)
    }
});
exports.monitor = monitor;
