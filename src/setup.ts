import { install } from "./ui/command/install.js"
import { init } from "./ui/command/command.js"

~(async () => {
	await install()
	await init()
})()
