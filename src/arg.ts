import { Command } from "commander"
// import { init } from "./init"
import { list, upload, monitor } from "./command"

const program = new Command()

program.helpOption("-h, --help", "コマンドのヘルプを表示します。")

const version = "v" + require("../package.json").version
program.version(version, "-v, --version", "バージョンを表示します。")

// program.command("init")
// 	.description("opniz書き込み環境を構築します。")
// 	.action(async (cmd) => {
// 		// console.log(cmd)
// 		await init()
// 	})

program.command("upload <device-port>")
	.description("デバイスへopnizを書き込みます。")
	.requiredOption("-s, --ssid <ssid>", "デバイスを接続するWi-FiのSSIDを指定します。")
	.requiredOption("-p, --password <password>", "デバイスを接続するWi-Fiのパスワードを指定します。")
	.requiredOption("-a, --address <address>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのIPアドレスを指定します。")
	.option("-P, --port <port>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのポート番号を指定します。", "3000")
	.option("-i, --id <id>", "opniz IDを指定します。", "")
	.action(async (devicePort, cmd) => {
		// console.log(devicePort, cmd)
		await upload(devicePort, cmd.ssid, cmd.password, cmd.address, cmd.port, cmd.id)
	})

program.command("monitor <device-port>")
	.description("シリアルモニタを表示します。")
	.action(async (devicePort, cmd) => {
		// console.log(devicePort, cmd)
		await monitor(devicePort)
	})

program.command("list")
	.description("接続されているデバイス情報を表示します。")
	.action(async (cmd) => {
		// console.log(cmd)
		await list()
	})

program.parse(process.argv)
