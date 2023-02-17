# opniz CLI

opniz CLIは[opniz Arduino Library](https://github.com/miso-develop/opniz-arduino-m5atom)の[Basicスケッチ](https://github.com/miso-develop/opniz-arduino-m5atom/blob/main/examples/Basic/Basic.ino)を、コマンドから簡単に書き込めるCLIツールです。  
[Arduino CLI](https://github.com/arduino/arduino-cli)のラッパーCLIです。  

<img src="https://user-images.githubusercontent.com/22117028/148371155-569e2ae3-7655-4c5c-a38f-4d13dd1ada4b.gif" width="640">



## 対応デバイス

* M5Stack BASIC
* M5Stack Core2
* M5StickC
* M5ATOM Matrix
* M5ATOM Lite
* M5ATOM Echo
* M5ATOM U
* M5ATOMS3
* M5ATOMS3 Lite
* M5Stamp Pico
* M5Stamp S3
* その他ESP32、ESP32-PICO-D4、ESP32-S3デバイス



## インストール

```sh
$ npm install -g opniz-cli
```

インストール時に`~/.opniz-cli/`へ[Arduino CLI](https://github.com/arduino/arduino-cli)の環境をセットアップします。  
そのためインストールに数分かかり、約800MBほどストレージを消費します。  



## 使い方

```sh
$ opniz -h
Usage: index [options] [command]

Options:
  -v, --version                   バージョンを表示します。
  -h, --help                      コマンドのヘルプを表示します。

Commands:
  upload [options] [device-port]  デバイスへopnizを書き込みます。
  monitor [device-port]           シリアルモニタを表示します。
  list                            接続されているデバイス情報を表示します。
  arduino ["options"]             Arduino CLIを直接実行します。[options]をダブルクォーテーションで括って実行してください。（例：opniz arduino "version"）
  help [command]                  display help for command
```

### `upload`: opnizスケッチ書き込み

デバイスへopnizスケッチを書き込みます。  

デバイスのシリアルポートやWi-Fi情報、opnizプログラムを実行するマシンのIPアドレスといった情報を対話モードで入力していきます。  
シリアルポート、Wi-FiのSSID、IPアドレスの候補は動的にリスト生成されるので簡単に選択できます。  

```sh
opniz upload
```

<img src="https://user-images.githubusercontent.com/22117028/148371155-569e2ae3-7655-4c5c-a38f-4d13dd1ada4b.gif" width="640">

リストにない値を指定したい場合は`Other`を選択することで直接入力できます。  

また以下のようにオプション指定することで対話モードをスキップして実行できます。  
部分的なオプション指定も可能です。  

```sh
opniz upload <device-port> -s <ssid> -p <password> -a <address> -d <device> -P 3000
```

|オプション|必須|内容|
|---|:-:|---|
|`<device-port>`|✔|デバイスのシリアルポートを指定します。|
|`-s, --ssid <ssid>`|✔|デバイスを接続するWi-FiのSSIDを指定します。|
|`-p, --password <password>`|✔|デバイスを接続するWi-Fiのパスワードを指定します。|
|`-a, --address <address>`|✔|opnizプログラム実行マシンのIPアドレスまたはホスト名、ドメイン名を指定します。|
|`-d, --device <device>`|✔|デバイスを指定します。<br>`m5atom`、`m5stickc`、`m5stack`、`esp32`のいずれかを指定します。|
|`-P, --port <port>`|✔|opnizプログラムの通信ポート番号を指定します。|
|`-i, --id <id>`||opniz IDを指定します。|
|`-h, --help`||コマンドのヘルプを表示します。|

### `monitor`: シリアルモニタ

デバイスの`Serial.print`を出力します。  

`<device-port>`にデバイスのシリアルポートを指定して実行します。  

```sh
opniz monitor <device-port>
```

### `list`: ボードリスト表示

デバイスをPCへ接続した状態で実行するとボード情報（port等）が表示されます。

```sh
$ opniz list
シリアルポート Protocol タイプ               Board Name      FQBN                       Core
COM1          serial   Serial Port         Unknown
COM2          serial   Serial Port (USB)   Unknown
COM3          serial   Serial Port (USB)   TAMC Termod S3  esp32:esp32:tamc_termod_s3 esp32:esp32
```

### `arduino`: Arduino CLI直接実行

Arduino CLIを直接実行します。  
Arduino CLIコマンドをダブルクォーテーションで括って実行します。  

```sh
opniz arduino "<arduino-cli command>"
```

```sh
// example
$ opniz arduino "version"
$ opniz arduino "lib list"
```



## 関連リポジトリ

* [opniz SDK for Node.js](https://github.com/miso-develop/opniz-sdk-nodejs)
	* opnizデバイスをNode.jsから遠隔制御するためのSDK
* [opniz Arduino Library for M5Unified](https://github.com/miso-develop/opniz-arduino-m5unified)
	* M5Unified向けArduinoライブラリ
* [opniz Arduino Library for M5ATOM](https://github.com/miso-develop/opniz-arduino-m5atom)
	* M5ATOM向けArduinoライブラリ
* [opniz Arduino Library for ESP32](https://github.com/miso-develop/opniz-arduino-esp32)
	* ESP32向けArduinoライブラリ
* [opniz Server](https://github.com/miso-develop/opniz-server)
	* opniz Node.js SDKやopnizデバイスからのJSON RPCメッセージを中継するWebSocketサーバ



## ライセンス

[MIT](./LICENSE)
