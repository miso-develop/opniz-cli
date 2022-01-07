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
const util_1 = require("../util");
const config_1 = require("../../config");
$.verbose = false;
process.chdir(__dirname + "/../../../");
const sketchDir = "sketch";
const sketchPath = `./${sketchDir}/${sketchDir}.ino`;
const upload = (devicePort, ssid, password, address, port, id, device) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceInfo = config_1.deviceInfoList[device];
    try {
        yield createSketch(ssid, password, address, port, id, deviceInfo.sketch);
        yield (0, util_1.spinnerWrap)(`Install library`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                installDeviceLibrary(deviceInfo.library),
                installOpniz(deviceInfo.repo),
            ]);
        }), "succeed");
        yield uploadSketch(devicePort, deviceInfo.fqbn);
    }
    finally {
        fs.removeSync(sketchDir);
    }
});
exports.upload = upload;
const uploadSketch = (devicePort, fqbn) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, util_1.spinnerWrap)(`Compile sketch`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${config_1.arduinoCliPath} compile --fqbn ${fqbn} sketch`).stdout;
    }), "succeed");
    yield (0, util_1.spinnerWrap)(`Upload opniz to port: ${devicePort}`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${config_1.arduinoCliPath} upload --fqbn ${fqbn} --port ${devicePort} sketch`).stdout;
    }), "succeed");
});
const createSketch = (ssid, password, address, port = 3000, id = "", sketch) => __awaiter(void 0, void 0, void 0, function* () {
    const templateSketch = sketch;
    const templateSketchPath = `./template/${templateSketch}`;
    let sketchSource = fs.readFileSync(templateSketchPath, "utf-8");
    sketchSource = sketchSource.replace(/<SSID>/g, ssid);
    sketchSource = sketchSource.replace(/<PASSWORD>/g, password);
    sketchSource = sketchSource.replace(/<ADDRESS>/g, address);
    sketchSource = sketchSource.replace(/<PORT>/g, String(port));
    sketchSource = sketchSource.replace(/<ID>/g, id);
    if (!fs.existsSync(sketchDir))
        fs.mkdirSync(sketchDir);
    fs.writeFileSync(sketchPath, sketchSource);
});
const installDeviceLibrary = (library) => __awaiter(void 0, void 0, void 0, function* () {
    if (library === "")
        return;
    return (yield $((0, util_1.zxFormat)(`${config_1.arduinoCliPath} lib install ${library}`))).stdout;
});
const installOpniz = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield $((0, util_1.zxFormat)(`${config_1.arduinoCliPath} lib install --git-url ${repo}`))).stdout;
});
