import { __dirname, arduinoCliExec, spinnerWrap } from "./ui/util.js"
import { install } from "./ui/command/install.js"
import { init } from "./ui/command/command.js"

~(async () => {
	process.chdir(__dirname + "/../")
	await install()
	await init()
})()
