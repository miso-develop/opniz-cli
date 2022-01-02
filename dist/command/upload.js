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
exports.upload = void 0;
require("zx/globals");
const config_1 = require("../config");
const util_1 = require("./util");
const type_1 = require("../type");
$.verbose = false;
process.chdir(__dirname + "/../../");
const upload = (devicePort, ssid, password, address, port, id, device) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, util_1.spinnerWrap)(`Uploading opniz to port: ${devicePort}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            createSketch(ssid, password, address, port, id, device),
            installDeviceLibrary(device),
            installOpniz(device),
        ]);
        // TODO: デバイスにより分岐
        const fqbnList = {
            esp32: "esp32:esp32:esp32",
            m5atom: "esp32:esp32:m5stack-atom",
            m5stickc: "esp32:esp32:m5stick-c",
            m5stack: "esp32:esp32:m5stack-core-esp32",
        };
        const fqbn = fqbnList[device];
        return (yield $ `${config_1.cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout;
    }), "succeed");
});
exports.upload = upload;
const createSketch = (ssid, password, address, port = 3000, id = "", device = "m5atom") => __awaiter(void 0, void 0, void 0, function* () {
    const sketchDir = "sketch";
    const sketchPath = `./${sketchDir}/${sketchDir}.ino`;
    const templateSketch = getTemplateSketch(device);
    const templateSketchPath = `./template/${templateSketch}`;
    let sketchSource = fs.readFileSync(templateSketchPath, "utf-8");
    sketchSource = sketchSource.replace("<SSID>", ssid);
    sketchSource = sketchSource.replace("<PASSWORD>", password);
    sketchSource = sketchSource.replace("<ADDRESS>", address);
    sketchSource = sketchSource.replace("<PORT>", String(port));
    sketchSource = sketchSource.replace("<ID>", id);
    if (!fs.existsSync(sketchDir))
        fs.mkdirSync(sketchDir);
    fs.writeFileSync(sketchPath, sketchSource);
});
const getTemplateSketch = (device) => {
    switch (device) {
        case type_1.Device.esp32: return "esp32.ino";
        case type_1.Device.m5atom: return "m5atom.ino";
        case type_1.Device.m5stickc: return "m5stickc.ino";
        case type_1.Device.m5stack: return "m5stack.ino";
        default: throw new Error("Not found device!");
    }
};
const installDeviceLibrary = (device) => __awaiter(void 0, void 0, void 0, function* () {
    const m5Library = getM5Library(device);
    if (m5Library === "")
        return;
    yield (0, util_1.retryCommand)(`${config_1.cliPath} lib install ${m5Library}`, 10);
});
const getM5Library = (device) => {
    switch (device) {
        case type_1.Device.esp32: return "";
        case type_1.Device.m5atom: return "M5Atom@0.0.3 FastLED";
        case type_1.Device.m5stickc: return "M5StickC@0.2.3";
        case type_1.Device.m5stack: return "M5Stack@0.3.6";
        default: throw new Error("Not found device!");
    }
};
const installOpniz = (device) => __awaiter(void 0, void 0, void 0, function* () {
    const opnizLibrary = getOpnizLibrary(device);
    yield (0, util_1.retryCommand)(`${config_1.cliPath} lib install --git-url ${opnizLibrary}`, 10); // opniz Arduinoライブラリインストール
});
const getOpnizLibrary = (device) => {
    switch (device) {
        case type_1.Device.esp32: return "https://github.com/miso-develop/opniz-arduino-esp32";
        case type_1.Device.m5atom: return "https://github.com/miso-develop/opniz-arduino-m5atom";
        // case Device.m5stickc: return "https://github.com/miso-develop/opniz-arduino-m5stickc" // MEMO: リリースしたら差し替え
        case type_1.Device.m5stickc: return "https://github.com/miso-develop/opniz-arduino-esp32";
        // case Device.m5stack: return "https://github.com/miso-develop/opniz-arduino-m5stack" // MEMO: リリースしたら差し替え
        case type_1.Device.m5stack: return "https://github.com/miso-develop/opniz-arduino-esp32";
        default: throw new Error("Not found device!");
    }
};
