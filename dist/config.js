import "zx/globals";
import { Device } from "./type.js";
export const opnizRoot = `.`;
export const downloadPath = `${opnizRoot}/download`;
export const installPath = `${opnizRoot}/arduino-cli`;
export const arduinoCliPath = `${installPath}/arduino-cli`;
export const arduinoConfigPath = `${opnizRoot}/arduino-cli.yaml`;
export const opnizHomePath = `${os.homedir().replace(/\\/g, "/")}/.opniz-cli`;
export const arduinoDirsPath = `${opnizHomePath}/arduino-cli`;
export const arduinoCliVersion = "0.30.0";
export const boardManager = "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json";
export const core = "esp32:esp32@2.0.6";
export const dependenceLibraries = "ArduinoJson@6.20.0 WebSockets@2.3.6 ";
export const defaultDevice = Device["m5atom"];
export const defaultPort = 3000;
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
export const deviceInfoList = {
    [Device["esp32"]]: Object.assign({}, deviceInfoEsp32),
    [Device["esp32-pico"]]: Object.assign(Object.assign({}, deviceInfoEsp32), { fqbn: "esp32:esp32:pico32" }),
    [Device["esp32-s3"]]: Object.assign(Object.assign({}, deviceInfoEsp32), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [Device["m5stack"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-core-esp32" }),
    [Device["m5stack-core2"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-core2", sketch: "m5stack.ino" }),
    [Device["m5stickc"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stick-c" }),
    [Device["m5atom"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-atom" }),
    [Device["m5stamp-pico"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:m5stack-atom" }),
    [Device["m5atoms3"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [Device["m5atoms3-lite"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
    [Device["m5stamp-s3"]]: Object.assign(Object.assign({}, deviceInfoM5Unified), { fqbn: "esp32:esp32:esp32s3:CDCOnBoot=cdc" }),
};
