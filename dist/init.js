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
exports.init = void 0;
require("zx/globals");
$.verbose = false;
process.chdir(__dirname + "/../");
const cliPath = `./arduino-cli/arduino-cli`;
const configPath = `./arduino-cli.yaml`;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initConfig();
    yield Promise.all([
        installCore(),
        installLibrary(),
        installOpniz(),
    ]);
});
exports.init = init;
const initConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield $ `[[ ! -f ${configPath} ]]`.exitCode) === 0)
        yield $ `${cliPath} config init --dest-dir ./`;
    yield $ `${cliPath} config set board_manager.additional_urls https://dl.espressif.com/dl/package_esp32_index.json`; // ESP32用ボードマネージャ追加
    yield $ `${cliPath} config set library.enable_unsafe_install true`;
    for (const dir of ["data", "downloads", "user"]) {
        const dirPath = `./arduino-cli/${dir}`;
        yield $ `${cliPath} config set directories.${dir} ${dirPath}`;
    }
});
const installCore = () => __awaiter(void 0, void 0, void 0, function* () {
    // $.verbose = true // debug:
    // MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
    // await $`${cliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
    yield retryCommand(`${cliPath} core install esp32:esp32`, 30); // ESP32ボードパッケージインストール
});
const installLibrary = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: デバイスにより分岐
    const m5LibraryList = {
        m5atom: "M5Atom@0.0.3 FastLED",
        esp32: "",
    };
    const m5Library = m5LibraryList.m5atom;
    // MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
    // await $`${cliPath} lib update-index` // ライブラリのローカルキャッシュ更新
    yield retryCommand(`${cliPath} lib install ArduinoJson WebSockets ${m5Library}`, 10); // 依存ライブラリインストール
});
const installOpniz = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: デバイスにより分岐
    const opnizLibraryList = {
        m5atom: "https://github.com/miso-develop/opniz-arduino-m5atom",
        esp32: "https://github.com/miso-develop/opniz-arduino-esp32",
    };
    const opnizLibrary = opnizLibraryList.m5atom;
    yield retryCommand(`${cliPath} lib install --git-url ${opnizLibrary}`, 10); // opniz Arduinoライブラリインストール
});
const retryCommand = (command, max) => __awaiter(void 0, void 0, void 0, function* () {
    const pieces = [command];
    let count = 0;
    while (count < max) {
        if (count > 0)
            console.log("retry:", count, command); // debug:
        count++;
        if ((yield $(pieces).exitCode) === 0)
            return;
    }
});
