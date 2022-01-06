import "zx/globals"
import { retryCommand, spinnerWrap } from "../util"
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
		await spinnerWrap(`Create sketch`, async () => {
			await createSketch(ssid, password, address, port, id, deviceInfo.sketch)
		}, "succeed")
		
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
	await spinnerWrap(`Compile sketch`, async () => {
		return (await $`${arduinoCliPath} compile --fqbn ${fqbn} sketch`).stdout
	}, "succeed")
	
	await spinnerWrap(`Upload opniz to port: ${devicePort}`, async () => {
		return (await $`${arduinoCliPath} upload --fqbn ${fqbn} --port ${devicePort} sketch`).stdout
	}, "succeed")
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
	sketchSource = sketchSource.replace("<SSID>", ssid)
	sketchSource = sketchSource.replace("<PASSWORD>", password)
	sketchSource = sketchSource.replace("<ADDRESS>", address)
	sketchSource = sketchSource.replace("<PORT>", String(port))
	sketchSource = sketchSource.replace("<ID>", id)
	
	if (!fs.existsSync(sketchDir)) fs.mkdirSync(sketchDir)
	fs.writeFileSync(sketchPath, sketchSource)
}

const installDeviceLibrary = async (library: string): Promise<void> => {
	if (library === "") return
	await retryCommand(`${arduinoCliPath} lib install ${library}`, 1)
}

const installOpniz = async (repo: string): Promise<void> => {
	await retryCommand(`${arduinoCliPath} lib install --git-url ${repo}`, 1)
}
