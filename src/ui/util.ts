import "zx/globals"
import ora from "ora"
import util from "util"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { createRequire } from "module"
import { arduinoCliPath, core } from "../config.js"

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
export const require = createRequire(import.meta.url)

export const zxFormat = (templateStrings: string) => [templateStrings] as any as TemplateStringsArray

export const retryArduinoCli = async (command: string, max: number): Promise<string> => {
	let count = 0
	while (count < max) {
		if (count > 0) console.log("retry:", count, command) // debug:
		count++
		try {
			const result = await arduinoCliExec(command)
			if (!result.stderr) return result.stdout
		} catch (e) {
			console.error(e)
			await sleep(100)
		}
	}
	throw new Error(`retryArduinoCli: \`${command}\` failed after ${max} retries`)
}

export const spinnerWrap = async (text, func, stopType = "stop"): Promise<any> => {
	const spinner = ora(text).start()
	
	try {
		const result = await func()
		spinner[stopType]()
		return result
		
	} catch (e) {
		spinner.fail()
		throw e
	}
}

export const promiseExec = util.promisify(exec)

export const arduinoCliExec = (command) => promiseExec(`${path.normalize(arduinoCliPath)} ${command}`)

export const isLatestLibraries = async (libraries: string): Promise<boolean> => {
	const list = (await arduinoCliExec(`lib list`)).stdout
	return libraries.split(" ")
		.map(lib => !!(list.replace(/ +/g, "@").match(lib)))
		.every(matched => matched)
}

export const isLatestCore = async (): Promise<boolean> => {
	const list = (await arduinoCliExec(`core list`)).stdout
	return !!(list.replace(/ +/g, "@").match(core))
}

export const isLatestOpniz = async (repo: string): Promise<boolean> => {
	const githubApiUrl = repo.replace("github.com/", "api.github.com/repos/") + "/tags"
	const latestVersion = (await (await fetch(githubApiUrl)).json() as any)[0].name
	const opnizType = repo.split("/").pop()?.split("-").pop()
	const opnizLibrary = opnizType + latestVersion.replace("v", "@")
	const list = (await arduinoCliExec(`lib list`)).stdout
	return !!(list.replace(/ +/g, "@").match(opnizLibrary))
}
