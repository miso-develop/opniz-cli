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
exports.install = void 0;
require("zx/globals");
const adm_zip_1 = __importDefault(require("adm-zip"));
const tar_1 = __importDefault(require("tar"));
const config_js_1 = require("../../config.js");
const type_js_1 = require("../../type.js");
$.verbose = false;
process.chdir(__dirname + "/../../../");
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    const osInfo = getOSInfo();
    const url = getDownloadUrl(osInfo);
    yield download(url);
    yield extract(osInfo.extension);
});
exports.install = install;
const getOSInfo = () => {
    const platform = getPlatform();
    return {
        platform,
        arch: getArch(platform),
        extension: getExtension(platform),
    };
};
const getPlatform = () => {
    // https://nodejs.org/api/process.html#processplatform
    // "aix", "darwin", "freebsd", "linux", "openbsd", "sunos", "win32"
    switch (os.platform()) {
        case "win32": return type_js_1.Platform["Windows"];
        case "darwin": return type_js_1.Platform["macOS"];
        case "linux": return type_js_1.Platform["Linux"];
        default: return type_js_1.Platform["Linux"];
    }
};
const getArch = (platform) => {
    // MEMO: M1 macの場合だとarchでARM64が返ってくるが2022/1/1現在非対応のため、macOSならarchは64bit固定で返す
    if (platform === type_js_1.Platform["macOS"])
        return type_js_1.Architecture["64bit"];
    // https://nodejs.org/api/process.html#processarch
    // "arm", "arm64", "ia32", "mips", "mipsel", "ppc", "ppc64", "s390", "s390x", "x32", "x64"
    switch (os.arch()) {
        case "arm": return type_js_1.Architecture["ARMv7"];
        case "arm64": return type_js_1.Architecture["ARM64"];
        case "x32": return type_js_1.Architecture["32bit"];
        case "x64": return type_js_1.Architecture["64bit"];
        default: return type_js_1.Architecture["64bit"];
    }
};
const getExtension = (platform) => {
    switch (platform) {
        case type_js_1.Platform["Windows"]: return type_js_1.Extension[".zip"];
        case type_js_1.Platform["macOS"]: return type_js_1.Extension[".tar.gz"];
        case type_js_1.Platform["Linux"]: return type_js_1.Extension[".tar.gz"];
        default: return type_js_1.Extension[".tar.gz"];
    }
};
const getDownloadUrl = ({ platform, arch, extension }) => {
    // https://arduino.github.io/arduino-cli/0.20/installation/#latest-release
    // Linux,	32bit,	tar.gz
    // Linux,	64bit,	tar.gz
    // Linux,	ARMv7,	tar.gz
    // Linux,	ARM64,	tar.gz
    // Windows,	32bit,	zip
    // Windows,	64bit,	zip
    // macOS,	64bit,	tar.gz
    return `https://downloads.arduino.cc/arduino-cli/arduino-cli_${config_js_1.arduinoCliVersion}_${platform}_${arch}${extension}`;
};
const download = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const downloadStream = response.body;
    const fileStream = fs.createWriteStream(config_js_1.downloadPath);
    yield new Promise((resolve, reject) => {
        downloadStream.pipe(fileStream).on("finish", resolve);
        downloadStream.on("error", reject);
    });
});
const extract = (extension) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(config_js_1.installPath))
        fs.mkdirSync(config_js_1.installPath);
    switch (extension) {
        case type_js_1.Extension[".zip"]:
            yield extractZip();
            break;
        case type_js_1.Extension[".tar.gz"]:
            yield extractTarGz();
            break;
    }
    fs.unlinkSync(config_js_1.downloadPath);
});
const extractZip = () => __awaiter(void 0, void 0, void 0, function* () {
    const zip = new adm_zip_1.default(config_js_1.downloadPath);
    zip.extractAllTo(config_js_1.installPath, true);
    fs.copyFileSync(`${config_js_1.installPath}/arduino-cli.exe`, `${config_js_1.installPath}/arduino-cli`);
});
const extractTarGz = () => __awaiter(void 0, void 0, void 0, function* () {
    let extractor = tar_1.default.x({ cwd: config_js_1.installPath });
    yield new Promise((resolve, reject) => {
        fs.createReadStream(config_js_1.downloadPath).pipe(extractor).on("finish", resolve);
    });
});
