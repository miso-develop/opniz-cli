import "zx/globals"
import { init } from "./init"
import { arduinoCliExec, spinnerWrap, isLatestLibraries, isLatestOpniz } from "../util"
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
			await init()
			
			await Promise.all([
				installDeviceLibraries(deviceInfo.library),
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

const installDeviceLibraries = async (libraries: string): Promise<string | void> => {
	if (libraries === "") return
	if (await isLatestLibraries(libraries)) return
	return (await arduinoCliExec(`lib install ${libraries}`)).stdout
}

const installOpniz = async (repo: string): Promise<string | void> => {
	if (await isLatestOpniz(repo)) return
	return (await arduinoCliExec(`lib install --git-url ${repo}`)).stdout
}
