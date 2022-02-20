import ora from "ora"

export const zxFormat = (templateStrings: string) => [templateStrings] as any as TemplateStringsArray

export const retryCommand = async (command: string, max: number): Promise<string> => {
	const pieces = zxFormat(command)
	let count = 0
	while (count < max) {
		if (count > 0) console.log("retry:", count, command) // debug:
		count++
		try {
			const result = await $(pieces)
			if (result.exitCode === 0) return result.stdout
		} catch (e) {
			console.error(e)
		}
	}
	throw new Error(`retryCommand: \`${command}\` failed after ${max} retries`)
}

export const spinnerWrap = async (text, func, stopType = "stop") => {
	const spinner = ora(text).start()
	
	try {
		const result = await func()
		if (result) console.log(result.replace(/(\n\n)+/, ""))
		spinner[stopType]()
		
	} catch (e) {
		spinner.fail()
		throw e
	}
}
