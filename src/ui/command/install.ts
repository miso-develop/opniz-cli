import "zx/globals"
import AdmZip from "adm-zip"
import tar from "tar"
import { downloadPath, installPath, arduinoCliVersion } from "../../config.js"
import { OSInfo, Platform, Architecture, Extension } from "../../type.js"

$.verbose = false
process.chdir(__dirname + "/../../../")

export const install = async (): Promise<void> => {
	const osInfo = getOSInfo()
	const url = getDownloadUrl(osInfo)
	await download(url)
	await extract(osInfo.extension)
}



const getOSInfo = (): OSInfo => {
	const platform = getPlatform()
	return {
		platform,
		arch: getArch(platform),
		extension: getExtension(platform),
	}
}

const getPlatform = (): Platform => {
	// https://nodejs.org/api/process.html#processplatform
	// "aix", "darwin", "freebsd", "linux", "openbsd", "sunos", "win32"
	switch (os.platform()) {
		case "win32": return Platform["Windows"]
		case "darwin": return Platform["macOS"]
		case "linux": return Platform["Linux"]
		default: return Platform["Linux"]
	}
}

const getArch = (platform: Platform): Architecture => {
	// MEMO: M1 macの場合だとarchでARM64が返ってくるが2022/1/1現在非対応のため、macOSならarchは64bit固定で返す
	if (platform === Platform["macOS"]) return Architecture["64bit"]
	
	// https://nodejs.org/api/process.html#processarch
	// "arm", "arm64", "ia32", "mips", "mipsel", "ppc", "ppc64", "s390", "s390x", "x32", "x64"
	switch (os.arch()) {
		case "arm": return Architecture["ARMv7"]
		case "arm64": return Architecture["ARM64"]
		case "x32": return Architecture["32bit"]
		case "x64": return Architecture["64bit"]
		default: return Architecture["64bit"]
	}
}

const getExtension = (platform: Platform): Extension => {
	switch (platform) {
		case Platform["Windows"]: return Extension[".zip"]
		case Platform["macOS"]: return Extension[".tar.gz"]
		case Platform["Linux"]: return Extension[".tar.gz"]
		default: return Extension[".tar.gz"]
	}
}



const getDownloadUrl = ({platform, arch, extension}: OSInfo): string => {
	// https://arduino.github.io/arduino-cli/0.20/installation/#latest-release
	// Linux,	32bit,	tar.gz
	// Linux,	64bit,	tar.gz
	// Linux,	ARMv7,	tar.gz
	// Linux,	ARM64,	tar.gz
	// Windows,	32bit,	zip
	// Windows,	64bit,	zip
	// macOS,	64bit,	tar.gz
	
	return `https://downloads.arduino.cc/arduino-cli/arduino-cli_${arduinoCliVersion}_${platform}_${arch}${extension}`
}



const download = async (url: string): Promise<void> => {
	const response = await fetch(url)
	const downloadStream = response.body as any as NodeJS.ReadableStream
	const fileStream = fs.createWriteStream(downloadPath)
	
	await new Promise((resolve, reject) => {
		downloadStream.pipe(fileStream).on("finish", resolve)
		downloadStream.on("error", reject)
	})
}



const extract = async (extension: Extension): Promise<void> => {
	if (!fs.existsSync(installPath)) fs.mkdirSync(installPath)
	switch (extension) {
		case Extension[".zip"]: await extractZip(); break
		case Extension[".tar.gz"]: await extractTarGz(); break
	}
	fs.unlinkSync(downloadPath)
}

const extractZip = async (): Promise<void> => {
	const zip = new AdmZip(downloadPath)
	zip.extractAllTo(installPath, true)
	fs.copyFileSync(`${installPath}/arduino-cli.exe`, `${installPath}/arduino-cli`)
}

const extractTarGz = async (): Promise<void> => {
	let extractor = tar.x({ cwd: installPath })
	await new Promise((resolve, reject) => {
		fs.createReadStream(downloadPath).pipe(extractor).on("finish", resolve)
	})
}
