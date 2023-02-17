import { Command, Option, InvalidArgumentError } from "commander"
import { require } from "./util.js"
import { init, list, upload, monitor, arduino } from "./command/command.js"
import { uploadPrompt, monitorPrompt } from "./prompt.js"

const program = new Command()

program.helpOption("-h, --help", "コマンドのヘルプを表示します。")

const version = "v" + require("../../package.json").version
program.version(version, "-v, --version", "バージョンを表示します。")

// MEMO: install時に実行してるのでhelpには出さない隠しコマンド
program.command("init", { hidden: true })
	.description("opniz書き込み環境を構築します。")
	.addHelpCommand(false)
	.action(async (options) => {
		// console.log(options)
		await init()
	})

program.command("upload [device-port]")
	.description("デバイスへopnizを書き込みます。")
	.option("-s, --ssid <ssid>", "デバイスを接続するWi-FiのSSIDを指定します。")
	.option("-p, --password <password>", "デバイスを接続するWi-Fiのパスワードを指定します。")
	.option("-a, --address <address>", "opnizプログラム実行マシンのIPアドレスまたはホスト名、ドメイン名を指定します。")
	.option("-d, --device <device>", "デバイスを指定します。(choices: \"m5atom\", \"m5stickc\", \"m5stack\", \"esp32\")")
	.option("-P, --port <port>", "opnizプログラムの通信ポート番号を指定します。")
	.option("-i, --id <id>", "opniz IDを指定します。")
	.action(async (devicePort, options) => {
		// console.log(devicePort, options)
		const answers = await uploadPrompt({ devicePort, ...options })
		await upload(answers.devicePort, answers.ssid, answers.password, answers.address, answers.port, answers.id, answers.device)
	})

program.command("monitor [device-port]")
	.description("シリアルモニタを表示します。")
	.action(async (devicePort, options) => {
		// console.log(devicePort, options)
		const answers = await monitorPrompt({ devicePort })
		await monitor(answers.devicePort)
	})

program.command("list")
	.description("接続されているデバイス情報を表示します。")
	.action(async (options) => {
		// console.log(options)
		await list()
	})

program.command("arduino [\"options\"]")
	.description("Arduino CLIを直接実行します。[options]をダブルクォーテーションで括って実行してください。（例：opniz arduino \"version\"）")
	.action(async (options) => {
		// console.log(options)
		await arduino(options ?? "")
	})

program.parse(process.argv)
