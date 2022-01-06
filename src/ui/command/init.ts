import "zx/globals"
import { retryCommand } from "../util"
import { opnizRoot, arduinoCliPath, arduinoConfigPath, arduinoDirsPath } from "../../config"

$.verbose = false
process.chdir(__dirname + "/../../../")

export const init = async () => {
	// $.verbose = true // DEBUG:
	await initConfig()
	
	await Promise.all([
		installCore(),
		installLibrary(),
	])
}

const initConfig = async (): Promise<void> => {
	if (await $`[[ ! -f ${arduinoConfigPath} ]]`.exitCode === 0) await $`${arduinoCliPath} config init --dest-dir ${opnizRoot}`
	
	await $`${arduinoCliPath} config set board_manager.additional_urls https://dl.espressif.com/dl/package_esp32_index.json` // ESP32用ボードマネージャ追加
	await $`${arduinoCliPath} config set library.enable_unsafe_install true`
	await $`${arduinoCliPath} config set metrics.enabled false`
	// await $`${arduinoCliPath} config set sketch.always_export_binaries true` // MEMO: なくても良さげ
	await $`${arduinoCliPath} config set updater.enable_notification false`
	
	for (const dir of ["data", "downloads", "user"]) await $`${arduinoCliPath} config set directories.${dir} ${arduinoDirsPath}/${dir}`
}

const installCore = async (): Promise<void> => {
	// MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
	// await $`${arduinoCliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
	
	await retryCommand(`${arduinoCliPath} core install esp32:esp32`, 50) // ESP32ボードパッケージインストール
}

const installLibrary = async (): Promise<void> => {
	// MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
	// await $`${arduinoCliPath} lib update-index` // ライブラリのローカルキャッシュ更新
	
	await retryCommand(`${arduinoCliPath} lib install ArduinoJson WebSockets`, 10) // 依存ライブラリインストール
}
