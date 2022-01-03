import "zx/globals"
import { cliPath, configPath } from "../config"
import { retryCommand } from "./util"

$.verbose = false
process.chdir(__dirname + "/../../")

export const init = async () => {
	// $.verbose = true // DEBUG:
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
	await $`${cliPath} config set metrics.enabled false`
	// await $`${cliPath} config set sketch.always_export_binaries true` // MEMO: なくても良さげ
	await $`${cliPath} config set updater.enable_notification false`
	
	// MEMO: インストールディレクトリのパス長制限をできる限り緩和するため、各ディレクトリをできる限り短いパスへ
	const dirs = {
		"data": "./d",
		"downloads": "./dl",
		"user": "./u",
	}
	for (const [dir, path] of Object.entries(dirs)) await $`${cliPath} config set directories.${dir} ${path}`
}

const installCore = async (): Promise<void> => {
	// MEMO: なくても良さげかつ`lib update-index`がM1 macでエラーで止まったので同様にコメントアウト
	// await $`${cliPath} core update-index` // ボードパッケージのローカルキャッシュ更新
	
	await retryCommand(`${cliPath} core install esp32:esp32`, 30) // ESP32ボードパッケージインストール
}

const installLibrary = async (): Promise<void> => {
	// MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
	// await $`${cliPath} lib update-index` // ライブラリのローカルキャッシュ更新
	
	await retryCommand(`${cliPath} lib install ArduinoJson WebSockets`, 10) // 依存ライブラリインストール
}
