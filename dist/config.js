"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceInfoList = exports.defaultPort = exports.defaultDevice = exports.dependenceLibraries = exports.core = exports.boardManager = exports.arduinoCliVersion = exports.arduinoDirsPath = exports.opnizHomePath = exports.arduinoConfigPath = exports.arduinoCliPath = exports.installPath = exports.downloadPath = exports.opnizRoot = void 0;
require("zx/globals");
const type_js_1 = require("./type.js");
exports.opnizRoot = `.`;
exports.downloadPath = `${exports.opnizRoot}/download`;
exports.installPath = `${exports.opnizRoot}/arduino-cli`;
exports.arduinoCliPath = `${exports.installPath}/arduino-cli`;
exports.arduinoConfigPath = `${exports.opnizRoot}/arduino-cli.yaml`;
exports.opnizHomePath = `${os.homedir().replace(/\\/g, "/")}/.opniz-cli`;
exports.arduinoDirsPath = `${exports.opnizHomePath}/arduino-cli`;
exports.arduinoCliVersion = "0.30.0";
exports.boardManager = "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json";
exports.core = "esp32:esp32@2.0.6";
exports.dependenceLibraries = "ArduinoJson@6.20.0 WebSockets@2.3.6 ";
exports.defaultDevice = type_js_1.Device["m5atom"];
exports.defaultPort = 3000;
const deviceInfoEsp32 = {
    fqbn: "esp32:esp32:esp32",
    library: "",
    repo: "https://github.com/miso-develop/opniz-arduino-esp32",
    sketch: "esp32.ino",
};
const deviceInfoM5Unified = {
    fqbn: "",
    library: "M5Unified@0.1.4 FastLED@3.5.0 ",
    repo: "https://github.com/miso-develop/opniz-arduino-m5unified",
};
exports.deviceInfoList = {
    [type_js_1.Device["esp32"]]: Object.assign({}, deviceInfoEsp32),
    [type_js_1.Device["esp32-pico"]]: Object.assign(Object.assign({}, deviceInfoEsp32), { fqbn: "esp32:esp32:pico32" }),
    [type_js_1.Device["esp32-s3"]]: Object.assign(Object.assign({}, deviceInfoEsp32), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [type_js_1.Device["m5stack"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-core-esp32" }),
    [type_js_1.Device["m5stack-core2"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-core2", sketch: "m5stack.ino" }),
    [type_js_1.Device["m5stickc"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stick-c" }),
    [type_js_1.Device["m5atom"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-atom" }),
    [type_js_1.Device["m5stamp-pico"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-atom" }),
    [type_js_1.Device["m5atoms3"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [type_js_1.Device["m5atoms3-lite"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [type_js_1.Device["m5stamp-s3"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
};
