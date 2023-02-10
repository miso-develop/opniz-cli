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
        installLibraries(),
    ]);
});
exports.init = init;
const initConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(`${config_1.arduinoConfigPath}`))
        yield (0, util_1.arduinoCliExec)(`config init --dest-dir ${config_1.opnizRoot}`);
    yield (0, util_1.arduinoCliExec)(`config set board_manager.additional_urls ${config_1.boardManager}`); // ESP32用ボードマネージャ追加
    yield (0, util_1.arduinoCliExec)(`config set library.enable_unsafe_install true`);
    yield (0, util_1.arduinoCliExec)(`config set metrics.enabled false`);
    // await arduinoCliExec(`config set sketch.always_export_binaries true`) // MEMO: なくても良さげ
    yield (0, util_1.arduinoCliExec)(`config set updater.enable_notification false`);
    for (const dir of ["data", "downloads", "user"])
        yield (0, util_1.arduinoCliExec)(`config set directories.${dir} ${config_1.arduinoDirsPath}/${dir}`);
});
const installCore = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, util_1.isLatestCore)())
        return;
    yield (0, util_1.arduinoCliExec)(`core update-index`); // ボードパッケージのローカルキャッシュ更新
    yield (0, util_1.retryArduinoCli)(`core install ${config_1.core}`, 50); // ESP32ボードパッケージインストール
});
const installLibraries = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, util_1.isLatestLibraries)(config_1.dependenceLibraries))
        return;
    yield (0, util_1.arduinoCliExec)(`lib update-index`); // ライブラリのローカルキャッシュ更新
    yield (0, util_1.retryArduinoCli)(`lib install ${config_1.dependenceLibraries}`, 10); // opniz依存ライブラリインストール
});
