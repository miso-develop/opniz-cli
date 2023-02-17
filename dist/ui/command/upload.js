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
const init_js_1 = require("./init.js");
const util_js_1 = require("../util.js");
const config_js_1 = require("../../config.js");
$.verbose = false;
process.chdir(__dirname + "/../../../");
const sketchDir = "sketch";
const sketchPath = `./${sketchDir}/${sketchDir}.ino`;
const upload = (devicePort, ssid, password, address, port, id, device) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceInfo = config_js_1.deviceInfoList[device];
    try {
        yield createSketch(ssid, password, address, port, id, device);
        yield (0, util_js_1.spinnerWrap)(`Install library`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, init_js_1.init)();
            yield Promise.all([
                installDeviceLibraries(deviceInfo.library),
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
const createSketch = (ssid, password, address, port = 3000, id = "", device) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const deviceInfo = config_js_1.deviceInfoList[device];
    const templateSketch = (_a = deviceInfo.sketch) !== null && _a !== void 0 ? _a : `${device}.ino`;
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
const installDeviceLibraries = (libraries) => __awaiter(void 0, void 0, void 0, function* () {
    if (libraries === "")
        return;
    if (yield (0, util_js_1.isLatestLibraries)(libraries))
        return;
    yield (0, util_js_1.arduinoCliExec)(`lib update-index`);
    return (yield (0, util_js_1.arduinoCliExec)(`lib install ${libraries}`)).stdout;
});
const installOpniz = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, util_js_1.isLatestOpniz)(repo))
        return;
    return (yield (0, util_js_1.arduinoCliExec)(`lib install --git-url ${repo}`)).stdout;
});
const uploadSketch = (devicePort, fqbn) => __awaiter(void 0, void 0, void 0, function* () {
    const compileResult = yield (0, util_js_1.spinnerWrap)(`Compile sketch`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield (0, util_js_1.arduinoCliExec)(`compile --fqbn ${fqbn} sketch`)).stdout;
    }), "succeed");
    console.log(compileResult.replace(/(\n\n)+/, ""));
    const uploadResult = yield (0, util_js_1.spinnerWrap)(`Upload opniz to port: ${devicePort}`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield (0, util_js_1.arduinoCliExec)(`upload --fqbn ${fqbn} --port ${devicePort} sketch`)).stdout;
    }), "succeed");
    console.log(uploadResult.replace(/(\n\n)+/, ""));
});
