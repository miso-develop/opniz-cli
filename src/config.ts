import { DeviceInfoList, Device } from "./type"

export const opnizRoot = `.`

export const downloadPath = `${opnizRoot}/download`
export const installPath = `${opnizRoot}/arduino-cli`

export const arduinoCliPath = `${installPath}/arduino-cli`
export const arduinoConfigPath = `${opnizRoot}/arduino-cli.yaml`

export const opnizHomePath = `${os.homedir().replace(/\\/g, "/")}/.opniz-cli`
export const arduinoDirsPath = `${opnizHomePath}/arduino-cli`



export const arduinoCliVersion = "0.29.0"



export const boardManager = "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json"
export const core = "esp32:esp32@2.0.6"
export const dependenceLibraries = "ArduinoJson@6.17.3 WebSockets@2.3.6 "



export const deviceInfoList: DeviceInfoList = {
	[Device.esp32]: {
		fqbn: "esp32:esp32:pico32",
		library: "",
		repo: "https://github.com/miso-develop/opniz-arduino-esp32",
		sketch: "esp32.ino",
	},
	[Device.m5atom]: {
		fqbn: "esp32:esp32:m5stack-atom",
		library: "M5Atom@0.1.0 FastLED ",
		repo: "https://github.com/miso-develop/opniz-arduino-m5atom",
		sketch: "m5atom.ino",
	},
	[Device.m5stickc]: {
		fqbn: "esp32:esp32:m5stick-c",
		library: "M5StickC@0.2.8 ",
		// repo: "https://github.com/miso-develop/opniz-arduino-m5stickc", // MEMO: リリースしたら差し替え
		repo: "https://github.com/miso-develop/opniz-arduino-esp32",
		sketch: "m5stickc.ino",
	},
	[Device.m5stack]: {
		fqbn: "esp32:esp32:m5stack-core-esp32",
		library: "M5Stack@0.4.3 ",
		// repo: "https://github.com/miso-develop/opniz-arduino-m5stack", // MEMO: リリースしたら差し替え
		repo: "https://github.com/miso-develop/opniz-arduino-esp32",
		sketch: "m5stack.ino",
	},
}
