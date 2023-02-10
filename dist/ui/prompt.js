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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorPrompt = exports.uploadPrompt = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
require("zx/globals");
const node_wifi_1 = __importDefault(require("node-wifi"));
const util_1 = require("./util");
const type_1 = require("../type");
$.verbose = false;
process.chdir(__dirname + "/../../");
const deviceList = Object.keys(type_1.Device);
const uploadPrompt = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield setUploadQuestions(options);
    const answers = yield runPrompt(questions);
    const mergedAnswers = mergeAnswers(options, answers);
    // console.log(mergedAnswers) // DEBUG:
    return mergedAnswers;
});
exports.uploadPrompt = uploadPrompt;
const monitorPrompt = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield setMonitorQuestions(options);
    const answers = yield runPrompt(questions);
    const mergedAnswers = Object.assign(Object.assign({}, options), answers);
    // console.log(mergedAnswers) // DEBUG:
    return mergedAnswers;
});
exports.monitorPrompt = monitorPrompt;
const getPortList = () => __awaiter(void 0, void 0, void 0, function* () {
    // MEMO: zxで`arduino-cli board list`を実行すると以降プロンプトでの文字列入力時の挙動がなぜかやばくなるため、child_process.execでの実行に変更
    // const result = (await $`${arduinoCliPath} board list`).stdout.replace(/(\n\n)+/, "")
    const result = (yield (0, util_1.arduinoCliExec)(`board list`)).stdout.replace(/(\n\n)+/, "");
    const portList = result
        .split("\n")
        .map(line => line.split(" ")[0])
        .filter((element, index) => index > 0);
    return portList;
});
const getSsidList = () => __awaiter(void 0, void 0, void 0, function* () {
    const networks = yield new Promise((resolve, reject) => {
        node_wifi_1.default.init();
        node_wifi_1.default.scan((error, networks) => error ? reject(error) : resolve(networks));
    });
    const ssidList = networks
        .map(network => network.ssid)
        .filter(ssid => ssid !== "")
        .reverse();
    return [...ssidList, "Other"];
});
const getAddressList = () => __awaiter(void 0, void 0, void 0, function* () {
    const addressList = Object.values(os.networkInterfaces())
        .flat()
        .filter((networkInterface) => networkInterface.family === "IPv4")
        .map(networkInterface => networkInterface.address)
        .filter(address => address !== "127.0.0.1")
        .sort()
        .reverse();
    return [...addressList, "Other"];
});
const validPortNumber = (value) => {
    const portNumber = Number(value);
    if (!portNumber)
        return false;
    if (portNumber < 1024)
        return false;
    if (portNumber > 65535)
        return false;
    return portNumber;
};
const validPromptPortNumber = (value) => {
    const errorMessage = "1024から65535までの数値を入力してください！";
    return !!validPortNumber(value) || errorMessage;
};
const validDeviceName = (deviceName) => deviceList.includes(deviceName.toLowerCase());
const setUploadQuestions = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const [ssidList, addressList] = yield Promise.all([
        getSsidList(),
        getAddressList(),
    ]);
    const questions = [];
    if (!options.devicePort)
        questions.push({
            name: "devicePort",
            type: "list",
            choices: yield (0, util_1.spinnerWrap)("Loading serial port", getPortList),
            message: "デバイスのシリアルポートを選択してください:",
        });
    if (!options.ssid && ssidList.length > 1)
        questions.push({
            name: "ssid",
            type: "list",
            choices: ssidList,
            message: "デバイスを接続するWi-FiのSSIDを選択してください:",
        }, {
            name: "ssidInput",
            type: "input",
            message: "デバイスを接続するWi-FiのSSIDを入力してください:",
            validate: input => input !== "" || "値を入力してください！",
            when: (answers) => answers.ssid === "Other",
        });
    if (!options.ssid && ssidList.length === 1)
        questions.push({
            name: "ssidInput",
            type: "input",
            message: "デバイスを接続するWi-FiのSSIDを入力してください:",
            validate: input => input !== "" || "値を入力してください！",
        });
    if (!options.password)
        questions.push({
            name: "password",
            type: "password",
            mask: "*",
            message: "デバイスを接続するWi-Fiのパスワードを入力してください:",
            validate: input => input !== "" || "値を入力してください！",
        });
    if (!options.address)
        questions.push({
            name: "address",
            type: "list",
            choices: addressList,
            message: "opnizプログラム実行マシンのIPアドレスを選択してください:",
        }, {
            name: "addressInput",
            type: "input",
            message: "opnizプログラム実行マシンのIPアドレスまたはホスト名、ドメイン名を入力してください:",
            validate: input => input !== "" || "値を入力してください！",
            when: (answers) => answers.address === "Other",
        });
    if (!options.device || !validDeviceName(options.device))
        questions.push({
            name: "device",
            type: "list",
            choices: deviceList,
            default: "m5atom",
            message: "デバイスを選択してください:",
        });
    if (!options.port || !validPortNumber(options.port))
        questions.push({
            name: "port",
            type: "input",
            default: 3000,
            message: "opnizプログラムの通信ポート番号を入力してください:",
            validate: validPromptPortNumber,
        });
    // MEMO: ユースケースが限られるので対話モードからは除外
    // if (!options.id) questions.push({
    // 	name: "id",
    // 	type: "input",
    // 	default: "\"\"",
    // 	message: "opniz IDを入力してください:",
    // })
    return questions;
});
const setMonitorQuestions = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = [];
    yield (0, util_1.spinnerWrap)("Loading serial port", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!options.devicePort)
            questions.push({
                name: "devicePort",
                type: "list",
                choices: yield getPortList(),
                message: "デバイスのシリアルポートを選択してください:",
            });
    }));
    return questions;
});
const runPrompt = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt(questions);
    if (answers.ssidInput) {
        answers.ssid = answers.ssidInput;
        delete answers.ssidInput;
    }
    if (answers.addressInput) {
        answers.address = answers.addressInput;
        delete answers.addressInput;
    }
    if (answers.id === "\"\"")
        answers.id = "";
    return answers;
});
const mergeAnswers = (options, answers) => {
    const mergedAnswers = Object.assign(Object.assign({}, options), answers);
    mergedAnswers.device = mergedAnswers.device.toLowerCase();
    mergedAnswers.port = Number(mergedAnswers.port);
    if (!mergedAnswers.id)
        mergedAnswers.id = "";
    return mergedAnswers;
};
