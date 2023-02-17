import "zx/globals"
import { __dirname, arduinoCliExec, retryArduinoCli, isLatestLibraries, isLatestCore } from "../util.js"
import { opnizRoot, arduinoCliPath, arduinoConfigPath, arduinoDirsPath, boardManager, core, dependenceLibraries } from "../../config.js"

$.verbose = false
process.chdir(__dirname + "/../../../")

export const init = async () => {
	// $.verbose = true // DEBUG:
	await initConfig()
	
	await Promise.all([
		installCore(),
		installLibraries(),
	])
}

const initConfig = async (): Promise<void> => {
	if (!fs.existsSync(`${arduinoConfigPath}`)) await arduinoCliExec(`config init --dest-dir ${opnizRoot}`)
	
	await arduinoCliExec(`config set board_manager.additional_urls ${boardManager}`) // ESP32用ボードマネージャ追加
	await arduinoCliExec(`config set library.enable_unsafe_install true`)
	await arduinoCliExec(`config set metrics.enabled false`)
	// await arduinoCliExec(`config set sketch.always_export_binaries true`) // MEMO: なくても良さげ
	await arduinoCliExec(`config set updater.enable_notification false`)
	
	for (const dir of ["data", "downloads", "user"]) await arduinoCliExec(`config set directories.${dir} ${arduinoDirsPath}/${dir}`)
}

const installCore = async (): Promise<void> => {
	if (await isLatestCore()) return
	await arduinoCliExec(`core update-index`) // ボードパッケージのローカルキャッシュ更新
	await retryArduinoCli(`core install ${core}`, 50) // ESP32ボードパッケージインストール
}

const installLibraries = async (): Promise<void> => {
	if (await isLatestLibraries(dependenceLibraries)) return
	await arduinoCliExec(`lib update-index`) // ライブラリのローカルキャッシュ更新
	await retryArduinoCli(`lib install ${dependenceLibraries}`, 10) // opniz依存ライブラリインストール
}
