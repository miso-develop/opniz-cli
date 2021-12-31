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
require("zx/globals");
const adm_zip_1 = __importDefault(require("adm-zip"));
const tar_1 = __importDefault(require("tar"));
const init_1 = require("./init");
$.verbose = false;
process.chdir(__dirname + "/../");
const downloadPath = "./download";
const installPath = "./arduino-cli/";
const getUrl = () => {
    // https://arduino.github.io/arduino-cli/0.20/installation/#latest-release
    // Linux,	32bit,	tar.gz
    // Linux,	64bit,	tar.gz
    // Linux,	ARMv7,	tar.gz
    // Linux,	ARM64,	tar.gz
    // Windows,	32bit,	zip
    // Windows,	64bit,	zip
    // macOS,	64bit,	tar.gz
    let platform = getPlatform();
    let arch = getArch(platform);
    let ext = getExt(platform);
    const url = `https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_${platform}_${arch}${ext}`;
    return { url, ext };
};
const Platform = {
    "Windows": "Windows",
    "macOS": "macOS",
    "Linux": "Linux"
};
const getPlatform = () => {
    // https://nodejs.org/api/process.html#processplatform
    // "aix"
    // "darwin"
    // "freebsd"
    // "linux"
    // "openbsd"
    // "sunos"
    // "win32"
    switch (os.platform()) {
        case "win32": return Platform["Windows"];
        case "darwin": return Platform["macOS"];
        case "linux": return Platform["Linux"];
        default: return Platform["Linux"];
    }
};
const Architecture = {
    "ARMv7": "ARMv7",
    "ARM64": "ARM64",
    "32bit": "32bit",
    "64bit": "64bit",
};
const getArch = (platform) => {
    // MEMO: M1 macの場合だとarchでARM64が返ってくるが2022/1/1現在非対応のため、macOSならarchは64bit固定で返す
    if (platform === Platform["macOS"])
        return Architecture["64bit"];
    // https://nodejs.org/api/process.html#processarch
    // "arm"
    // "arm64"
    // "ia32"
    // "mips"
    // "mipsel"
    // "ppc"
    // "ppc64"
    // "s390"
    // "s390x"
    // "x32"
    // "x64"
    switch (os.arch()) {
        case "arm": return Architecture["ARMv7"];
        case "arm64": return Architecture["ARM64"];
        case "x32": return Architecture["32bit"];
        case "x64": return Architecture["64bit"];
        default: return Architecture["64bit"];
    }
};
const Extension = {
    ".zip": ".zip",
    ".tar.gz": ".tar.gz",
};
const getExt = (platform) => {
    switch (platform) {
        case Platform["Windows"]: return Extension[".zip"];
        case Platform["macOS"]: return Extension[".tar.gz"];
        case Platform["Linux"]: return Extension[".tar.gz"];
        default: return Extension[".tar.gz"];
    }
};
const download = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const downloadStream = response.body;
    const fileStream = fs.createWriteStream(downloadPath);
    yield new Promise((resolve, reject) => {
        downloadStream.pipe(fileStream);
        downloadStream.on("error", reject);
        fileStream.on("finish", resolve);
    });
});
const extract = (ext) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(installPath))
        fs.mkdirSync(installPath);
    if (ext === Extension[".zip"])
        yield extractZip();
    if (ext === Extension[".tar.gz"])
        yield extractTarGz();
    fs.unlinkSync(downloadPath);
});
const extractZip = () => __awaiter(void 0, void 0, void 0, function* () {
    const zip = new adm_zip_1.default(downloadPath);
    zip.extractAllTo(installPath, true);
    fs.renameSync(installPath + "arduino-cli.exe", installPath + "arduino-cli");
});
const extractTarGz = () => __awaiter(void 0, void 0, void 0, function* () {
    var extractor = tar_1.default.x({ cwd: installPath });
    yield new Promise((resolve, reject) => {
        fs.createReadStream(downloadPath).pipe(extractor).on("finish", resolve);
    });
});
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    const { url, ext } = getUrl();
    yield download(url);
    yield extract(ext);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield install();
    yield (0, init_1.init)();
}))();
