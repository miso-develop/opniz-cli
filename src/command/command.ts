import "zx/globals"
import { spinnerWrap } from "./util"
import { init } from "./init"
import { upload } from "./upload"
import { arduinoCliPath } from "../config"

$.verbose = false
process.chdir(__dirname + "/../../")

const list = async (): Promise<void> => {
	await spinnerWrap("Loading board list", async () => {
		return (await $`${arduinoCliPath} board list`).stdout.replace(/(\n\n)+/, "")
	})
}

const monitor = async (devicePort: string): Promise<void> => {
	try {
		await $`${arduinoCliPath} monitor --port ${devicePort}`.pipe(process.stdout)
	} catch (e) {
		// console.log(e.message)
	}
}

const arduino = async (options: string): Promise<void> => {
	try {
		const command = `${arduinoCliPath} ${options}`
		const pieces = [command] as any as TemplateStringsArray
		await $(pieces).pipe(process.stdout)
		
	} catch (e) {
		// console.log(e.message)
	}
}

export {
	init,
	upload,
	list,
	monitor,
	arduino,
}
