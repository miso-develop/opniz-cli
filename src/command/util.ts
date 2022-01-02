import ora from "ora"

export const retryCommand = async (command: string, max: number): Promise<void> => {
	const pieces = [command] as any as TemplateStringsArray
	let count = 0
	while (count < max) {
		if (count > 0) console.log("retry:", count, command) // debug:
		count++
		if (await $(pieces).exitCode === 0) return
	}
}

export const spinnerWrap = async (text, func, stopType = "stop") => {
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
