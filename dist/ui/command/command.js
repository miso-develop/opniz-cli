var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "zx/globals";
import { spinnerWrap } from "../util.js";
import { init } from "./init.js";
import { upload } from "./upload.js";
import { arduinoCliPath } from "../../config.js";
$.verbose = false;
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield spinnerWrap("Loading board list", () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield $ `${arduinoCliPath} board list`).stdout.replace(/(\n\n)+/, "");
    }));
    console.log(result);
});
const monitor = (devicePort) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield $ `${arduinoCliPath} monitor --port ${devicePort} --config baudrate=115200`.pipe(process.stdout);
    }
    catch (e) {
        // console.log(e.message)
    }
});
const arduino = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = `${arduinoCliPath} ${options}`;
        const pieces = [command];
        yield $(pieces).pipe(process.stdout);
    }
    catch (e) {
        // console.log(e.message)
    }
});
export { init, upload, list, monitor, arduino, };
