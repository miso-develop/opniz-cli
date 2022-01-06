import "zx/globals"
import AdmZip from "adm-zip"
import tar from "tar"
import { downloadPath, installPath } from "../../config"
import { Platform, Architecture, Extension } from "../../type"

export const install = async (): Promise<void> => {
	const { url, ext } = getUrl()
	await download(url)
	await extract(ext)
}



const getUrl = (): { url: string; ext: Extension } => {
	// https://arduino.github.io/arduino-cli/0.20/installation/#latest-release
	// Linux,	32bit,	tar.gz
	// Linux,	64bit,	tar.gz
	// Linux,	ARMv7,	tar.gz
	// Linux,	ARM64,	tar.gz
	// Windows,	32bit,	zip
	// Windows,	64bit,	zip
	// macOS,	64bit,	tar.gz
	
	let platform = getPlatform()
	let arch = getArch(platform)
	let ext = getExt(platform)
	// const url = `https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_${platform}_${arch}${ext}` // MEMO: latest
	const url = `https://downloads.arduino.cc/arduino-cli/arduino-cli_0.20.2_${platform}_${arch}${ext}` // MEMO: 0.20.2
	return { url, ext }
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

const getExt = (platform: Platform): Extension => {
	switch (platform) {
		case Platform["Windows"]: return Extension[".zip"]
		case Platform["macOS"]: return Extension[".tar.gz"]
		case Platform["Linux"]: return Extension[".tar.gz"]
		default: return Extension[".tar.gz"]
	}
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



const extract = async (ext: Extension): Promise<void> => {
	if (!fs.existsSync(installPath)) fs.mkdirSync(installPath)
	switch (ext) {
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
