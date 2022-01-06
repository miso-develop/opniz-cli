import { install } from "./ui/command/install"
import { init } from "./ui/command/command"

~(async () => {
	process.chdir(__dirname + "/../")
	await install()
	await init()
})()
