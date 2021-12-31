import "zx/globals"

$.verbose = false
process.chdir(__dirname + "/../")

const cliPath = `./arduino-cli/arduino-cli`
const configPath = `./arduino-cli.yaml`



const init = async () => {
	await initConfig()
	await Promise.all([
		installCore(),
		installLibrary(),
		installOpniz(),
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
	// TODO: デバイスにより分岐
	const m5LibraryList = {
		m5atom: "M5Atom@0.0.3 FastLED",
		esp32: "",
	}
	const m5Library = m5LibraryList.m5atom
	
	// MEMO: なくても良さげかつM1 macでエラーで止まったのでコメントアウト
	// await $`${cliPath} lib update-index` // ライブラリのローカルキャッシュ更新
	
	await retryCommand(`${cliPath} lib install ArduinoJson WebSockets ${m5Library}`, 10) // 依存ライブラリインストール
}

const installOpniz = async (): Promise<void> => {
	// TODO: デバイスにより分岐
	const opnizLibraryList = {
		m5atom: "https://github.com/miso-develop/opniz-arduino-m5atom",
		esp32: "https://github.com/miso-develop/opniz-arduino-esp32",
	}
	const opnizLibrary = opnizLibraryList.m5atom
	
	await retryCommand(`${cliPath} lib install --git-url ${opnizLibrary}`, 10) // opniz Arduinoライブラリインストール
}

const retryCommand = async (command: string, max: number): Promise<void> => {
	const pieces = [command] as any as TemplateStringsArray
	let count = 0
	while (count < max) {
		if (count > 0) console.log("retry:", count, command) // debug:
		count++
		if (await $(pieces).exitCode === 0) return
	}
}



export { init }
