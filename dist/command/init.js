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
const config_1 = require("../config");
const util_1 = require("./util");
$.verbose = false;
process.chdir(__dirname + "/../../");
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    // $.verbose = true // DEBUG:
    yield initConfig();
    yield Promise.all([
        installCore(),
        installLibrary(),
    ]);
});
exports.init = init;
const initConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield $ `[[ ! -f ${config_1.configPath} ]]`.exitCode) === 0)
        yield $ `${config_1.cliPath} config init --dest-dir ./`;
    yield $ `${config_1.cliPath} config set board_manager.additional_urls https://dl.espressif.com/dl/package_esp32_index.json`; // ESP32用ボードマネージャ追加
    yield $ `${config_1.cliPath} config set library.enable_unsafe_install true`;
    yield $ `${config_1.cliPath} config set metrics.enabled false`;
    // await $`${cliPath} config set sketch.always_export_binaries true` // MEMO: なくても良さげ
    yield $ `${config_1.cliPath} config set updater.enable_notification false`;
    // MEMO: インストールディレクトリのパス長制限をできる限り緩和するため、各ディレクトリをできる限り短いパスへ
    const dirs = {
        "data": "./d",
        "downloads": "./dl",
        "user": "./u",
    };
    for (const [dir, path] of Object.entries(dirs))
        yield $ `${config_1.cliPath} config set directories.${dir} ${path}`;
});
const installCore = () => __awaiter(void 0, void 0, void 0, function* () {
    // MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
    // await $`${cliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
    yield (0, util_1.retryCommand)(`${config_1.cliPath} core install esp32:esp32`, 30); // ESP32ボードパッケージインストール
});
const installLibrary = () => __awaiter(void 0, void 0, void 0, function* () {
    // MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
    // await $`${cliPath} lib update-index` // ライブラリのローカルキャッシュ更新
    yield (0, util_1.retryCommand)(`${config_1.cliPath} lib install ArduinoJson WebSockets`, 10); // 依存ライブラリインストール
});
