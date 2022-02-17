"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceInfoList = exports.arduinoDirsPath = exports.opnizHomePath = exports.arduinoConfigPath = exports.arduinoCliPath = exports.installPath = exports.downloadPath = exports.opnizRoot = void 0;
const type_1 = require("./type");
exports.opnizRoot = `.`;
exports.downloadPath = `${exports.opnizRoot}/download`;
exports.installPath = `${exports.opnizRoot}/arduino-cli`;
exports.arduinoCliPath = `${exports.installPath}/arduino-cli`;
exports.arduinoConfigPath = `${exports.opnizRoot}/arduino-cli.yaml`;
exports.opnizHomePath = `${os.homedir().replace(/\\/g, "/")}/.opniz-cli`;
exports.arduinoDirsPath = `${exports.opnizHomePath}/arduino-cli`;
exports.deviceInfoList = {
    [type_1.Device.esp32]: {
        fqbn: "esp32:esp32:esp32",
        library: "",
        repo: "https://github.com/miso-develop/opniz-arduino-esp32",
        sketch: "esp32.ino",
    },
    [type_1.Device.m5atom]: {
        fqbn: "esp32:esp32:m5stack-atom",
        library: "M5Atom@0.0.3 FastLED",
        repo: "https://github.com/miso-develop/opniz-arduino-m5atom",
        sketch: "m5atom.ino",
    },
    [type_1.Device.m5stickc]: {
        fqbn: "esp32:esp32:m5stick-c",
        library: "M5StickC@0.2.3",
        // repo: "https://github.com/miso-develop/opniz-arduino-m5stickc", // MEMO: リリースしたら差し替え
        repo: "https://github.com/miso-develop/opniz-arduino-esp32",
        sketch: "m5stickc.ino",
    },
    [type_1.Device.m5stack]: {
        fqbn: "esp32:esp32:m5stack-core-esp32",
        library: "M5Stack@0.3.6",
        // repo: "https://github.com/miso-develop/opniz-arduino-m5stack", // MEMO: リリースしたら差し替え
        repo: "https://github.com/miso-develop/opniz-arduino-esp32",
        sketch: "m5stack.ino",
    },
};
