"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const command_1 = require("./command/command");
const program = new commander_1.Command();
program.helpOption("-h, --help", "コマンドのヘルプを表示します。");
const version = "v" + require("../package.json").version;
program.version(version, "-v, --version", "バージョンを表示します。");
// program.command("init")
// 	.description("opniz書き込み環境を構築します。")
// 	.action(async (cmd) => {
// 		// console.log(cmd)
// 		await init()
// 	})
const validNumber = (value) => {
    const number = Number(value);
    if (!number)
        throw new commander_1.InvalidArgumentError('Not a number.');
    if (number < 1024)
        throw new commander_1.InvalidArgumentError('WELL KNOWN PORT NUMBERS.');
    if (number > 65535)
        throw new commander_1.InvalidArgumentError('Valid port number has been exceeded.');
    return number;
};
program.command("upload <device-port>")
    .description("デバイスへopnizを書き込みます。")
    .requiredOption("-s, --ssid <ssid>", "デバイスを接続するWi-FiのSSIDを指定します。")
    .requiredOption("-p, --password <password>", "デバイスを接続するWi-Fiのパスワードを指定します。")
    .requiredOption("-a, --address <address>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのIPアドレスまたはホスト名、ドメイン名を指定します。")
    .addOption(new commander_1.Option("-P, --port <port>", "デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのポート番号を指定します。")
    .default("3000")
    .argParser(validNumber))
    .option("-i, --id <id>", "opniz IDを指定します。", "")
    .addOption(new commander_1.Option("-d, --device <device>", "デバイス種別を指定します。")
    .default("m5atom")
    .choices(["esp32", "m5atom", "m5stickc", "m5stack"]))
    .action((devicePort, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(devicePort, cmd)
    yield (0, command_1.upload)(devicePort, cmd.ssid, cmd.password, cmd.address, Number(cmd.port), cmd.id, cmd.device);
}));
program.command("monitor <device-port>")
    .description("シリアルモニタを表示します。")
    .action((devicePort, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(devicePort, cmd)
    yield (0, command_1.monitor)(devicePort);
}));
program.command("list")
    .description("接続されているデバイス情報を表示します。")
    .action((cmd) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(cmd)
    yield (0, command_1.list)();
}));
program.parse(process.argv);
