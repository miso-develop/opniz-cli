var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "zx/globals";
import { init } from "./init.js";
import { __dirname, arduinoCliExec, spinnerWrap, isLatestLibraries, isLatestOpniz } from "../util.js";
import { arduinoCliPath, deviceInfoList } from "../../config.js";
$.verbose = false;
process.chdir(__dirname + "/../../../");
const sketchDir = "sketch";
const sketchPath = `./${sketchDir}/${sketchDir}.ino`;
export const upload = (devicePort, ssid, password, address, port, id, device) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceInfo = deviceInfoList[device];
    try {
        yield createSketch(ssid, password, address, port, id, device);
        yield spinnerWrap(`Install library`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield init();
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
const createSketch = (ssid, password, address, port = 3000, id = "", device) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const deviceInfo = deviceInfoList[device];
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
    if (yield isLatestLibraries(libraries))
        return;
    yield arduinoCliExec(`lib update-index`);
    return (yield arduinoCliExec(`lib install ${libraries}`)).stdout;
});
const installOpniz = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isLatestOpniz(repo))
        return;
    return (yield arduinoCliExec(`lib install --git-url ${repo}`)).stdout;
});
const uploadSketch = (devicePort, fqbn) => __awaiter(void 0, void 0, void 0, function* () {
    const compileResult = yield spinnerWrap(`Compile sketch`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${arduinoCliPath} compile --fqbn ${fqbn} sketch`).stdout;
    }), "succeed");
    console.log(compileResult.replace(/(\n\n)+/, ""));
    const uploadResult = yield spinnerWrap(`Upload opniz to port: ${devicePort}`, () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${arduinoCliPath} upload --fqbn ${fqbn} --port ${devicePort} sketch`).stdout;
    }), "succeed");
    console.log(uploadResult.replace(/(\n\n)+/, ""));
});
