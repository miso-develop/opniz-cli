import { Command, Option, InvalidArgumentError } from "commander"
import { init, list, upload, monitor, arduino } from "./command/command"

const program = new Command()

program.helpOption("-h, --help", "コマンドのヘルプを表示します。")

const version = "v" + require("../package.json").version
program.version(version, "-v, --version", "バージョンを表示します。")

// MEMO: install時に実行してるのでコマンドとしてはなくて良さげ
// program.command("init")
// 	.description("opniz書き込み環境を構築します。")
// 	.action(async (options) => {
// 		// console.log(options)
// 		await init()
// 	})

const validNumber = (value: string): number => {
	const number = Number(value)
	if (!number) throw new InvalidArgumentError('Not a number.')
	if (number < 1024) throw new InvalidArgumentError('WELL KNOWN PORT NUMBERS.')
	if (number > 65535) throw new InvalidArgumentError('Valid port number has been exceeded.')
	return number
}

program.command("upload <device-port>")
	.description("デバイスへopnizを書き込みます。")
	.requiredOption("-s, --ssid <ssid>", "デバイスを接続するWi-FiのSSIDを指定します。")
	.requiredOption("-p, --password <password>", "デバイスを接続するWi-Fiのパスワードを指定します。")
	.requiredOption("-a, --address <address>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのIPアドレスまたはホスト名、ドメイン名を指定します。")
	.addOption(new Option("-P, --port <port>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのポート番号を指定します。")
		.default("3000")
		.argParser(validNumber)
	)
	.option("-i, --id <id>", "opniz IDを指定します。", "")
	.addOption(new Option("-d, --device <device>", "デバイス種別を指定します。")
		.default("m5atom")
		.choices(["esp32", "m5atom", "m5stickc", "m5stack"])
	)
	.action(async (devicePort, options) => {
		// console.log(devicePort, options)
		await upload(devicePort, options.ssid, options.password, options.address, Number(options.port), options.id, options.device)
	})

program.command("monitor <device-port>")
	.description("シリアルモニタを表示します。")
	.action(async (devicePort, options) => {
		// console.log(devicePort, options)
		await monitor(devicePort)
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
