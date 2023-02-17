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
import ora from "ora";
import util from "util";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { arduinoCliPath, core } from "../config.js";
export const getFilename = (meta) => fileURLToPath(meta.url);
export const getDirname = (meta) => path.dirname(fileURLToPath(meta.url));
export const require = createRequire(import.meta.url);
export const zxFormat = (templateStrings) => [templateStrings];
export const retryArduinoCli = (command, max) => __awaiter(void 0, void 0, void 0, function* () {
    let count = 0;
    while (count < max) {
        if (count > 0)
            console.log("retry:", count, command); // debug:
        count++;
        try {
            const result = yield arduinoCliExec(command);
            if (!result.stderr)
                return result.stdout;
        }
        catch (e) {
            console.error(e);
            yield sleep(100);
        }
    }
    throw new Error(`retryArduinoCli: \`${command}\` failed after ${max} retries`);
});
export const spinnerWrap = (text, func, stopType = "stop") => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora(text).start();
    try {
        const result = yield func();
        spinner[stopType]();
        return result;
    }
    catch (e) {
        spinner.fail();
        throw e;
    }
});
export const promiseExec = util.promisify(exec);
export const arduinoCliExec = (command) => promiseExec(`${path.normalize(arduinoCliPath)} ${command}`);
export const isLatestLibraries = (libraries) => __awaiter(void 0, void 0, void 0, function* () {
    const list = (yield arduinoCliExec(`lib list`)).stdout;
    return libraries.split(" ")
        .map(lib => !!(list.replace(/ +/g, "@").match(lib)))
        .every(matched => matched);
});
export const isLatestCore = () => __awaiter(void 0, void 0, void 0, function* () {
    const list = (yield arduinoCliExec(`core list`)).stdout;
    return !!(list.replace(/ +/g, "@").match(core));
});
export const isLatestOpniz = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const githubApiUrl = repo.replace("github.com/", "api.github.com/repos/") + "/tags";
    const latestVersion = (yield (yield fetch(githubApiUrl)).json())[0].name;
    const opnizType = (_a = repo.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split("-").pop();
    const opnizLibrary = opnizType + latestVersion.replace("v", "@");
    const list = (yield arduinoCliExec(`lib list`)).stdout;
    return !!(list.replace(/ +/g, "@").match(opnizLibrary));
});
