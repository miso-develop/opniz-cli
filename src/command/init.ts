import "zx/globals"
import { cliPath, configPath } from "../config"
import { retryCommand } from "./util"

$.verbose = false
process.chdir(__dirname + "/../../")

export const init = async () => {
	await initConfig()
	await Promise.all([
		installCore(),
		installLibrary(),
	])
}

const initConfig = async (): Promise<void> => {
	if (await $`[[ ! -f ${configPath} ]]`.exitCode === 0) await $`${cliPath} config init --dest-dir ./`
	
	await $`${cliPath} config set board_manager.additional_urls https://dl.espressif.com/dl/package_esp32_index.json` // ESP32用ボードマネージャ追加
	await $`${cliPath} config set library.enable_unsafe_install true`
	
	for (const dir of [ "data", "downloads", "user" ]) {
		const dirPath = `./arduino-cli/${dir}`
		await $`${cliPath} config set directories.${dir} ${dirPath}`
	}
}

const installCore = async (): Promise<void> => {
	// $.verbose = true // debug:
	
	// MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
	// await $`${cliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
	
	await retryCommand(`${cliPath} core install esp32:esp32`, 30) // ESP32ボードパッケージインストール
}

const installLibrary = async (): Promise<void> => {
	// MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
	// await $`${cliPath} lib update-index` // ライブラリのローカルキャッシュ更新
	
	await retryCommand(`${cliPath} lib install ArduinoJson WebSockets`, 10) // 依存ライブラリインストール
}
