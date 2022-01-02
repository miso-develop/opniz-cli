# opniz CLI

opniz CLIは[opniz Arduino Library](https://github.com/miso-develop/opniz-arduino-m5atom)の[Basicスケッチ](https://github.com/miso-develop/opniz-arduino-m5atom/blob/main/examples/Basic/Basic.ino)を、コマンドから簡単に書き込めるCLIツールです。  
[Arduino CLI](https://github.com/arduino/arduino-cli)のラッパーCLIです。  

M5Stack、M5Stick-C, M5ATOM, ESP32をサポートしています。  



## インストール方法

以下のコマンドで`./node_modules/opniz-cli/`へインストールされます。  

またインストール時に`./node_modules/opniz-cli/arduino-cli/`へ[Arduino CLI](https://github.com/arduino/arduino-cli)のダウンロードと、ESP32書き込み環境をセットアップします。  
そのためインストールに5分ほどかかり、約800MBほどストレージを消費します。  

```sh
$ npm install -g opniz-cli
```



## 使い方

```sh
$ opniz -h
Usage: index [options] [command]

Options:
  -v, --version                   バージョンを表示します。
  -h, --help                      コマンドのヘルプを表示します。

Commands:
  upload [options] <device-port>  デバイスへopnizを書き込みます。
  monitor <device-port>           シリアルモニタを表示します。
  list                            接続されているデバイス情報を表示します。
  arduino ["options"]             Arduino CLIを直接実行します。[options]をダブルクォーテーションで括って実行してください。（例：opniz arduino "version"）
  help [command]                  display help for command
```

### `list`: ボードリスト表示

デバイスをPCへ接続した状態で実行するとボード情報（port等）が表示されます。

```sh
$ opniz list
Port Protocol Type    Board Name FQBN Core
COM1 serial   Unknown
```

### `upload`: opnizスケッチ書き込み

デバイスのポート番号やWi-Fi情報、opnizプログラムを実行するマシンのIPアドレスといった情報を指定し、デバイスへopnizスケッチを書き込みます。  

* `<PORT>`に`opniz list`で表示されるデバイスの`port`を指定します
* `<SSID>`にWi-FiのSSIDを指定します
* `<PASSWORD>`にWi-Fiのパスワードを指定します
* `<ADDRESS>`にopnizプログラムを実行するマシンのIPアドレスを指定します

```sh
opniz upload <PORT> -s <SSID> -p <PASSWORD> -a <ADDRESS>
```

上記の必須オプション以外にも任意のオプションがいくつかあります。

|オプション|必須|内容|
|---|:-:|---|
|`-s`, `--ssid`|⭕|デバイスを接続するWi-FiのSSIDを指定します。|
|`-p`, `--password`|⭕|デバイスを接続するWi-Fiのパスワードを指定します。|
|`-a`, `--address`|⭕|デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのIPアドレスを指定します。|
|`-P`, `--port`||デバイスを制御するopnizプログラム実行マシンまたはopnizサーバのポート番号を指定します。<br>省略時は`3000`が指定されます。|
|`-i`, `--id`||opniz IDを指定します。|
|`-d`, `--device`||デバイス種別を指定します。<br>`esp32`、`m5atom`、`m5stickc`、`m5stack`のいずれか指定します。<br>省略時は`m5atom`が指定されます。|
|`-h`, `--help`||ヘルプを表示します。|

### `monitor`: シリアルモニタ

デバイスの`Serial.print`を出力します。  
`<PORT>`に`opniz list`で表示されるデバイスの`port`を指定します。  

```sh
opniz monitor <PORT>
```

### `arduino`: Arduino CLI直接実行

Arduino CLIを直接実行します。  
`<OPTIONS>`をダブルクォーテーションで括って実行します。  

```sh
opniz arduino "<OPTIONS>"
```

```sh
// example
$ opniz arduino "version"
$ opniz arduino "lib list"
```

## 関連リポジトリ

* [opniz Arduino Library for M5ATOM](https://github.com/miso-develop/opniz-arduino-m5atom)
	* M5ATOM向けArduinoライブラリ
* [opniz Arduino Library for ESP32](https://github.com/miso-develop/opniz-arduino-esp32)
	* ESP32向けArduinoライブラリ
* [opniz SDK for Node.js](https://github.com/miso-develop/opniz-sdk-nodejs)
	* opnizデバイスをNode.jsから遠隔制御するためのSDK
* [opniz Server](https://github.com/miso-develop/opniz-server)
	* opniz Node.js SDKやopnizデバイスからのJSON RPCメッセージを中継するWebSocketサーバ



## ライセンス

[MIT](./LICENSE)
