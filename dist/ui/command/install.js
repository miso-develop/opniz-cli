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
import AdmZip from "adm-zip";
import tar from "tar";
import { downloadPath, installPath, arduinoCliVersion } from "../../config.js";
import { Platform, Architecture, Extension } from "../../type.js";
export const install = () => __awaiter(void 0, void 0, void 0, function* () {
    const osInfo = getOSInfo();
    const url = getDownloadUrl(osInfo);
    yield download(url);
    yield extract(osInfo.extension);
});
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
        case "win32": return Platform["Windows"];
        case "darwin": return Platform["macOS"];
        case "linux": return Platform["Linux"];
        default: return Platform["Linux"];
    }
};
const getArch = (platform) => {
    // MEMO: M1 macの場合だとarchでARM64が返ってくるが2022/1/1現在非対応のため、macOSならarchは64bit固定で返す
    if (platform === Platform["macOS"])
        return Architecture["64bit"];
    // https://nodejs.org/api/process.html#processarch
    // "arm", "arm64", "ia32", "mips", "mipsel", "ppc", "ppc64", "s390", "s390x", "x32", "x64"
    switch (os.arch()) {
        case "arm": return Architecture["ARMv7"];
        case "arm64": return Architecture["ARM64"];
        case "x32": return Architecture["32bit"];
        case "x64": return Architecture["64bit"];
        default: return Architecture["64bit"];
    }
};
const getExtension = (platform) => {
    switch (platform) {
        case Platform["Windows"]: return Extension[".zip"];
        case Platform["macOS"]: return Extension[".tar.gz"];
        case Platform["Linux"]: return Extension[".tar.gz"];
        default: return Extension[".tar.gz"];
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
    return `https://downloads.arduino.cc/arduino-cli/arduino-cli_${arduinoCliVersion}_${platform}_${arch}${extension}`;
};
const download = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const downloadStream = response.body;
    const fileStream = fs.createWriteStream(downloadPath);
    yield new Promise((resolve, reject) => {
        downloadStream.pipe(fileStream).on("finish", resolve);
        downloadStream.on("error", reject);
    });
});
const extract = (extension) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(installPath))
        fs.mkdirSync(installPath);
    switch (extension) {
        case Extension[".zip"]:
            yield extractZip();
            break;
        case Extension[".tar.gz"]:
            yield extractTarGz();
            break;
    }
    fs.unlinkSync(downloadPath);
});
const extractZip = () => __awaiter(void 0, void 0, void 0, function* () {
    const zip = new AdmZip(downloadPath);
    zip.extractAllTo(installPath, true);
    fs.copyFileSync(`${installPath}/arduino-cli.exe`, `${installPath}/arduino-cli`);
});
const extractTarGz = () => __awaiter(void 0, void 0, void 0, function* () {
    let extractor = tar.x({ cwd: installPath });
    yield new Promise((resolve, reject) => {
        fs.createReadStream(downloadPath).pipe(extractor).on("finish", resolve);
    });
});
