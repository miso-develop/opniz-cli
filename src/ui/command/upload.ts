import "zx/globals"
import { zxFormat, spinnerWrap } from "../util"
import { arduinoCliPath, deviceInfoList } from "../../config"
import { Device, DeviceInfo } from "../../type"

$.verbose = false
process.chdir(__dirname + "/../../../")

const sketchDir = "sketch"
const sketchPath = `./${sketchDir}/${sketchDir}.ino`

export const upload = async (
	devicePort: string,
	ssid: string,
	password: string,
	address: string,
	port: number,
	id: string,
	device: Device,
): Promise<void> => {
	const deviceInfo: DeviceInfo = deviceInfoList[device]
	
	try {
		await createSketch(ssid, password, address, port, id, deviceInfo.sketch)
		
		await spinnerWrap(`Install library`, async () => {
			await Promise.all([
				installDeviceLibrary(deviceInfo.library),
				installOpniz(deviceInfo.repo),
			])
		}, "succeed")
		
		await uploadSketch(devicePort, deviceInfo.fqbn)
		
	} finally {
		fs.removeSync(sketchDir)
	}
}

const uploadSketch = async (devicePort: string, fqbn: string) => {
	const compileResult = await spinnerWrap(`Compile sketch`, async () => {
		return (await $`${arduinoCliPath} compile --fqbn ${fqbn} sketch`).stdout
	}, "succeed")
	console.log(compileResult.replace(/(\n\n)+/, ""))
	
	const uploadResult = await spinnerWrap(`Upload opniz to port: ${devicePort}`, async () => {
		return (await $`${arduinoCliPath} upload --fqbn ${fqbn} --port ${devicePort} sketch`).stdout
	}, "succeed")
	console.log(uploadResult.replace(/(\n\n)+/, ""))
}

const createSketch = async (
	ssid: string,
	password: string,
	address: string,
	port = 3000,
	id = "",
	sketch: string,
): Promise<void> => {
	const templateSketch = sketch
	const templateSketchPath = `./template/${templateSketch}`
	
	let sketchSource = fs.readFileSync(templateSketchPath, "utf-8")
	sketchSource = sketchSource.replace(/<SSID>/g, ssid)
	sketchSource = sketchSource.replace(/<PASSWORD>/g, password)
	sketchSource = sketchSource.replace(/<ADDRESS>/g, address)
	sketchSource = sketchSource.replace(/<PORT>/g, String(port))
	sketchSource = sketchSource.replace(/<ID>/g, id)
	
	if (!fs.existsSync(sketchDir)) fs.mkdirSync(sketchDir)
	fs.writeFileSync(sketchPath, sketchSource)
}

const installDeviceLibrary = async (library: string): Promise<string | void> => {
	if (library === "") return
	return (await $(zxFormat(`${arduinoCliPath} lib install ${library}`))).stdout
}

const installOpniz = async (repo: string): Promise<string | void> => {
	return (await $(zxFormat(`${arduinoCliPath} lib install --git-url ${repo}`))).stdout
}
