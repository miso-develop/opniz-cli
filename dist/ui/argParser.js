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
const prompt_1 = require("./prompt");
const program = new commander_1.Command();
program.helpOption("-h, --help", "コマンドのヘルプを表示します。");
const version = "v" + require("../../package.json").version;
program.version(version, "-v, --version", "バージョンを表示します。");
// MEMO: install時に実行してるのでhelpには出さない隠しコマンド
program.command("init", { hidden: true })
    .description("opniz書き込み環境を構築します。")
    .addHelpCommand(false)
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(options)
    yield (0, command_1.init)();
}));
program.command("upload [device-port]")
    .description("デバイスへopnizを書き込みます。")
    .option("-s, --ssid <ssid>", "デバイスを接続するWi-FiのSSIDを指定します。")
    .option("-p, --password <password>", "デバイスを接続するWi-Fiのパスワードを指定します。")
    .option("-a, --address <address>", "opnizプログラム実行マシンのIPアドレスまたはホスト名、ドメイン名を指定します。")
    .option("-d, --device <device>", "デバイスを指定します。(choices: \"m5atom\", \"m5stickc\", \"m5stack\", \"esp32\")")
    .option("-P, --port <port>", "opnizプログラムの通信ポート番号を指定します。")
    .option("-i, --id <id>", "opniz IDを指定します。")
    .action((devicePort, options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(devicePort, options)
    const answers = yield (0, prompt_1.uploadPrompt)(Object.assign({ devicePort }, options));
    yield (0, command_1.upload)(answers.devicePort, answers.ssid, answers.password, answers.address, answers.port, answers.id, answers.device);
}));
program.command("monitor [device-port]")
    .description("シリアルモニタを表示します。")
    .action((devicePort, options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(devicePort, options)
    const answers = yield (0, prompt_1.monitorPrompt)({ devicePort });
    yield (0, command_1.monitor)(answers.devicePort);
}));
program.command("list")
    .description("接続されているデバイス情報を表示します。")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(options)
    yield (0, command_1.list)();
}));
program.command("arduino [\"options\"]")
    .description("Arduino CLIを直接実行します。[options]をダブルクォーテーションで括って実行してください。（例：opniz arduino \"version\"）")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(options)
    yield (0, command_1.arduino)(options !== null && options !== void 0 ? options : "");
}));
program.parse(process.argv);
