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
const util_1 = require("../util");
const config_1 = require("../../config");
$.verbose = false;
process.chdir(__dirname + "/../../../");
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
    if ((yield $ `[[ ! -f ${config_1.arduinoConfigPath} ]]`.exitCode) === 0)
        yield $ `${config_1.arduinoCliPath} config init --dest-dir ${config_1.opnizRoot}`;
    yield $ `${config_1.arduinoCliPath} config set board_manager.additional_urls https://dl.espressif.com/dl/package_esp32_index.json`; // ESP32用ボードマネージャ追加
    yield $ `${config_1.arduinoCliPath} config set library.enable_unsafe_install true`;
    yield $ `${config_1.arduinoCliPath} config set metrics.enabled false`;
    // await $`${arduinoCliPath} config set sketch.always_export_binaries true` // MEMO: なくても良さげ
    yield $ `${config_1.arduinoCliPath} config set updater.enable_notification false`;
    for (const dir of ["data", "downloads", "user"])
        yield $ `${config_1.arduinoCliPath} config set directories.${dir} ${config_1.arduinoDirsPath}/${dir}`;
});
const installCore = () => __awaiter(void 0, void 0, void 0, function* () {
    // MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
    // await $`${arduinoCliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
    yield (0, util_1.retryCommand)(`${config_1.arduinoCliPath} core install esp32:esp32@1.0.6`, 50); // ESP32ボードパッケージインストール
});
const installLibrary = () => __awaiter(void 0, void 0, void 0, function* () {
    // MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
    // await $`${arduinoCliPath} lib update-index` // ライブラリのローカルキャッシュ更新
    yield (0, util_1.retryCommand)(`${config_1.arduinoCliPath} lib install ArduinoJson WebSockets`, 10); // 依存ライブラリインストール
});
