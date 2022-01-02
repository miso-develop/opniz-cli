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

export {
	init,
	upload,
	list,
	monitor,
}
