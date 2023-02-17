var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "zx/globals";
import { arduinoCliExec, retryArduinoCli, isLatestLibraries, isLatestCore } from "../util.js";
import { opnizRoot, arduinoConfigPath, arduinoDirsPath, boardManager, core, dependenceLibraries } from "../../config.js";
$.verbose = false;
export const init = () => __awaiter(void 0, void 0, void 0, function* () {
    // $.verbose = true // DEBUG:
    yield initConfig();
    yield Promise.all([
        installCore(),
        installLibraries(),
    ]);
});
const initConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(`${arduinoConfigPath}`))
        yield arduinoCliExec(`config init --dest-dir ${opnizRoot}`);
    yield arduinoCliExec(`config set board_manager.additional_urls ${boardManager}`); // ESP32用ボードマネージャ追加
    yield arduinoCliExec(`config set library.enable_unsafe_install true`);
    yield arduinoCliExec(`config set metrics.enabled false`);
    // await arduinoCliExec(`config set sketch.always_export_binaries true`) // MEMO: なくても良さげ
    yield arduinoCliExec(`config set updater.enable_notification false`);
    for (const dir of ["data", "downloads", "user"])
        yield arduinoCliExec(`config set directories.${dir} ${arduinoDirsPath}/${dir}`);
});
const installCore = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isLatestCore())
        return;
    yield arduinoCliExec(`core update-index`); // ボードパッケージのローカルキャッシュ更新
    yield retryArduinoCli(`core install ${core}`, 50); // ESP32ボードパッケージインストール
});
const installLibraries = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isLatestLibraries(dependenceLibraries))
        return;
    yield arduinoCliExec(`lib update-index`); // ライブラリのローカルキャッシュ更新
    yield retryArduinoCli(`lib install ${dependenceLibraries}`, 10); // opniz依存ライブラリインストール
});
