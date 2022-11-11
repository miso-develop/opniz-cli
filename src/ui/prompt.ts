import inquirer from "inquirer"
import "zx/globals"
import wifi from "node-wifi"
import { promiseExec, spinnerWrap } from "./util"
import { arduinoCliPath } from "../config"
import { Device } from "../type"

$.verbose = false
process.chdir(__dirname + "/../../")

const deviceList = Object.keys(Device)

export const uploadPrompt = async (options) => {
	const questions = await setUploadQuestions(options)
	const answers = await runPrompt(questions)
	const mergedAnswers = mergeAnswers(options, answers)
	// console.log(mergedAnswers) // DEBUG:
	return mergedAnswers
}

export const monitorPrompt = async (options) => {
	const questions = await setMonitorQuestions(options)
	const answers = await runPrompt(questions)
	const mergedAnswers = {...options, ...answers}
	// console.log(mergedAnswers) // DEBUG:
	return mergedAnswers
}



const getPortList = async (): Promise<string[]> => {
	// MEMO: zxで`arduino-cli board list`を実行すると以降プロンプトでの文字列入力時の挙動がなぜかやばくなるため、child_process.execでの実行に変更
	// const result = (await $`${arduinoCliPath} board list`).stdout.replace(/(\n\n)+/, "")
	const result = (await promiseExec(`${arduinoCliPath} board list`)).stdout.replace(/(\n\n)+/, "")
	
	const portList = result
		.split("\n")
		.map(line => line.split(" ")[0])
		.filter((element, index) => index > 0)
	return portList
}

const getSsidList = async (): Promise<string[]>=> {
	const networks: any[] = await new Promise((resolve, reject) => {
		wifi.init()
		wifi.scan((error, networks) => error ? reject(error) : resolve(networks))
	})
	const ssidList = networks
		.map(network => network.ssid)
		.filter(ssid => ssid !== "")
		.reverse()
	return [...ssidList, "Other"]
}

const getAddressList = async (): Promise<string[]> => {
	const addressList = Object.values(os.networkInterfaces())
		.flat()
		.filter((networkInterface) => (networkInterface as any).family === "IPv4")
		.map(networkInterface => (networkInterface as any).address)
		.filter(address => address !== "127.0.0.1")
		.sort()
		.reverse()
	return [...addressList, "Other"]
}



const validPortNumber = (value): number | false => {
	const portNumber = Number(value)
	if (!portNumber) return false
	if (portNumber < 1024) return false
	if (portNumber > 65535) return false
	return portNumber
}

const validPromptPortNumber = (value): true | string => {
	const errorMessage = "1024から65535までの数値を入力してください！"
	return !!validPortNumber(value) || errorMessage
}

const validDeviceName = (deviceName: string): boolean => deviceList.includes(deviceName.toLowerCase())



const setUploadQuestions = async (options): Promise<inquirer.QuestionCollection[]> => {
	const [portList, ssidList, addressList] = await spinnerWrap("Loading serial port", async (): Promise<string[][]> => {
		return Promise.all([
			getPortList(),
			getSsidList(),
			getAddressList(),
		])
	})
	
	const questions: inquirer.QuestionCollection[] = []
	
	if (!options.devicePort) questions.push({
		name: "devicePort",
		type: "list",
		choices: portList,
		message: "デバイスのシリアルポートを選択してください:",
	})
	
	if (!options.ssid && ssidList.length > 1) questions.push({
		name: "ssid",
		type: "list",
		choices: ssidList,
		message: "デバイスを接続するWi-FiのSSIDを選択してください:",
	}, {
		name: "ssidInput",
		type: "input",
		message: "デバイスを接続するWi-FiのSSIDを入力してください:",
		validate: input => input !== "" || "値を入力してください！",
		when: (answers) => answers.ssid === "Other",
	})
	if (!options.ssid && ssidList.length === 1) questions.push({
		name: "ssidInput",
		type: "input",
		message: "デバイスを接続するWi-FiのSSIDを入力してください:",
		validate: input => input !== "" || "値を入力してください！",
	})
		
	if (!options.password) questions.push({
		name: "password",
		type: "password",
		mask: "*",
		message: "デバイスを接続するWi-Fiのパスワードを入力してください:",
		validate: input => input !== "" || "値を入力してください！",
	})
		
	if (!options.address) questions.push({
		name: "address",
		type: "list",
		choices: addressList,
		message: "opnizプログラム実行マシンのIPアドレスを選択してください:",
	}, {
		name: "addressInput",
		type: "input",
		message: "opnizプログラム実行マシンのIPアドレスまたはホスト名、ドメイン名を入力してください:",
		validate: input => input !== "" || "値を入力してください！",
		when: (answers) => answers.address === "Other",
	})
		
	if (!options.device || !validDeviceName(options.device)) questions.push({
		name: "device",
		type: "list",
		choices: deviceList,
		default: "m5atom",
		message: "デバイスを選択してください:",
	})
		
	if (!options.port || !validPortNumber(options.port)) questions.push({
		name: "port",
		type: "input",
		default: 3000,
		message: "opnizプログラムの通信ポート番号を入力してください:",
		validate: validPromptPortNumber,
	})
		
	// MEMO: ユースケースが限られるので対話モードからは除外
	// if (!options.id) questions.push({
	// 	name: "id",
	// 	type: "input",
	// 	default: "\"\"",
	// 	message: "opniz IDを入力してください:",
	// })
	return questions
}

const setMonitorQuestions = async (options): Promise<inquirer.QuestionCollection[]> => {
	const questions: inquirer.QuestionCollection[] = []
	await spinnerWrap("Loading serial port", async () => {
		if (!options.devicePort) questions.push({
			name: "devicePort",
			type: "list",
			choices: await getPortList(),
			message: "デバイスのシリアルポートを選択してください:",
		})
	})
	return questions
}



const runPrompt = async (questions: inquirer.QuestionCollection<inquirer.Answers>[]) => {
	const answers = await inquirer.prompt(questions)
	
	if (answers.ssidInput) {
		answers.ssid = answers.ssidInput
		delete answers.ssidInput
	}
	if (answers.addressInput) {
		answers.address = answers.addressInput
		delete answers.addressInput
	}
	if (answers.id === "\"\"") answers.id = ""
	return answers
}

const mergeAnswers = (options, answers) => {
	const mergedAnswers = {...options, ...answers}
	mergedAnswers.device = mergedAnswers.device.toLowerCase()
	mergedAnswers.port = Number(mergedAnswers.port)
	if (!mergedAnswers.id) mergedAnswers.id = ""
	return mergedAnswers
}
