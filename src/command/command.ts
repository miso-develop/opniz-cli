import "zx/globals"
import { cliPath } from "../config"
import { spinnerWrap } from "./util"
import { init } from "./init"
import { upload } from "./upload"

$.verbose = false
process.chdir(__dirname + "/../../")

const list = async (): Promise<void> => {
	await spinnerWrap("Loading board list", async () => {
		return (await $`${cliPath} board list`).stdout.replace(/(\n\n)+/, "")
	})
}

const monitor = async (devicePort: string): Promise<void> => {
	try {
		await $`${cliPath} monitor --port ${devicePort}`.pipe(process.stdout)
	} catch(e) {
		// console.log(e.message)
	}
}

const arduino = async (options: string): Promise<void> => {
	try {
		const command = `${cliPath} ${options}`
		const pieces = [command] as any as TemplateStringsArray
		await $(pieces).pipe(process.stdout)
		
	} catch(e) {
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
