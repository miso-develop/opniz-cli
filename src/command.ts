import "zx/globals"
import ora from "ora"

$.verbose = false
process.chdir(__dirname + "/../")

const cliPath = `./arduino-cli/arduino-cli`



const spinnerWrap = async (text, func, stopType = "stop") => {
	const spinner = ora(text).start()
	
	try {
		const result = await func()
		spinner[stopType]()
		console.log(result)
		
	} catch(e) {
		spinner.fail()
		console.error(e.message)
	}
}

const upload = async (
	devicePort: string,
	ssid: string,
	password: string,
	address: string,
	port: string,
	id: string,
): Promise<void> => {
	await spinnerWrap(`Uploading opniz to port: ${devicePort}`, async () => {
		await createSketch(ssid, password, address, port, id)
		
		// TODO: デバイスにより分岐
		const fqbnList = {
			m5atom: "esp32:esp32:m5stack-atom",
		}
		const fqbn = fqbnList.m5atom
		
		// console.log((await $`${cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout)
		return (await $`${cliPath} compile --fqbn ${fqbn} --upload --port ${devicePort} sketch`).stdout
	}, "succeed")
	
}

const createSketch = async (
	ssid: string,
	password: string,
	address: string,
	port: string = "3000",
	id: string = "",
): Promise<void> => {
	const sketchDir = "sketch"
	const sketchPath = `./${sketchDir}/${sketchDir}.ino`
	
	// TODO: デバイスにより分岐
	const templateSketchList = {
		m5atom: "m5atom.ino",
		esp32: "esp32.ino",
	}
	const templateSketch = templateSketchList.m5atom
	const templateSketchPath = `./template/${templateSketch}`
	
	let sketchSource = fs.readFileSync(templateSketchPath, "utf-8")
	sketchSource = sketchSource.replace("<SSID>", ssid)
	sketchSource = sketchSource.replace("<PASSWORD>", password)
	sketchSource = sketchSource.replace("<ADDRESS>", address)
	sketchSource = sketchSource.replace("<PORT>", port)
	sketchSource = sketchSource.replace("<ID>", id)
	
	if (!fs.existsSync(sketchDir)) fs.mkdirSync(sketchDir)
	fs.writeFileSync(sketchPath, sketchSource)
}



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
	upload,
	list,
	monitor,
}
