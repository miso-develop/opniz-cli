import "zx/globals"
import { cliPath } from "../config"
import { retryCommand, spinnerWrap } from "./util"
import { Device } from "../type"

$.verbose = false
process.chdir(__dirname + "/../../")

export const upload = async (
	devicePort: string,
	ssid: string,
	password: string,
	address: string,
	port: number,
	id: string,
	device: Device,
): Promise<void> => {
	await spinnerWrap(`Uploading opniz to port: ${devicePort}`, async () => {
		await Promise.all([
			createSketch(ssid, password, address, port, id, device),
			installDeviceLibrary(device),
			installOpniz(device),
		])
		
		// TODO: デバイスにより分岐
		const fqbnList = {
			esp32: "esp32:esp32:esp32",
			m5atom: "esp32:esp32:m5stack-atom",
			m5stickc: "esp32:esp32:m5stick-c",
			m5stack: "esp32:esp32:m5stack-core-esp32",
		}
		const fqbn = fqbnList[device]
		return (await $`${cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout
	}, "succeed")
	
}

const createSketch = async (
	ssid: string,
	password: string,
	address: string,
	port: number = 3000,
	id: string = "",
	device: Device = "m5atom",
): Promise<void> => {
	const sketchDir = "sketch"
	const sketchPath = `./${sketchDir}/${sketchDir}.ino`
	
	const templateSketch = getTemplateSketch(device)
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

const getTemplateSketch = (device: Device): string => {
	switch (device) {
		case Device.esp32: return "esp32.ino"
		case Device.m5atom: return "m5atom.ino"
		case Device.m5stickc: return "m5stickc.ino"
		case Device.m5stack: return "m5stack.ino"
		default: throw new Error("Not found device!")
	}
}

const installDeviceLibrary = async (device: Device): Promise<void> => {
	const m5Library = getM5Library(device)
	if (m5Library === "") return
	await retryCommand(`${cliPath} lib install ${m5Library}`, 10)
}

const getM5Library = (device: Device): string => {
	switch (device) {
		case Device.esp32: return ""
		case Device.m5atom: return "M5Atom@0.0.3 FastLED"
		case Device.m5stickc: return "M5StickC@0.2.3"
		case Device.m5stack: return "M5Stack@0.3.6"
		default: throw new Error("Not found device!")
	}
}

const installOpniz = async (device: Device): Promise<void> => {
	const opnizLibrary = getOpnizLibrary(device)
	await retryCommand(`${cliPath} lib install --git-url ${opnizLibrary}`, 10) // opniz Arduinoライブラリインストール
}

const getOpnizLibrary = (device: Device): string => {
	switch (device) {
		case Device.esp32: return "https://github.com/miso-develop/opniz-arduino-esp32"
		case Device.m5atom: return "https://github.com/miso-develop/opniz-arduino-m5atom"
		
		// case Device.m5stickc: return "https://github.com/miso-develop/opniz-arduino-m5stickc" // MEMO: リリースしたら差し替え
		case Device.m5stickc: return "https://github.com/miso-develop/opniz-arduino-esp32"
		
		// case Device.m5stack: return "https://github.com/miso-develop/opniz-arduino-m5stack" // MEMO: リリースしたら差し替え
		case Device.m5stack: return "https://github.com/miso-develop/opniz-arduino-esp32"
		
		default: throw new Error("Not found device!")
	}
}
