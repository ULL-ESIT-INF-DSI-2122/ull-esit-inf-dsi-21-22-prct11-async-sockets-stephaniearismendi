"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
class Wrapper {
    constructor() {
    }
    /**
     * Method that checks if path is a file or a directory
     * @param path path to analyze
     * @returns true if the path is a directory, false otherwise
     */
    checkIfDirectory(path) {
        let isDirectory = false;
        if (fs.existsSync(path)) {
            const stats = fs.statSync(path);
            if (stats.isDirectory()) {
                isDirectory = true;
                console.log(chalk_1.default.green(`${path} is a directory`));
            }
            else if (stats.isFile()) {
                isDirectory = false;
                console.log(chalk_1.default.green(`${path} is a file`));
            }
        }
        else {
            console.log(chalk_1.default.red(`${path} does not exist`));
        }
        return isDirectory;
    }
    /**
     * Method that creates a directory
     * @param path path to the new directory
     */
    createDirectory(path) {
        fs_1.access(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                const mkdir = child_process_1.spawn('mkdir', ['-p', path]);
                mkdir.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(`${data}`));
                });
                mkdir.on('close', (code) => {
                    if (code === 0) {
                        console.log(chalk_1.default.green(`${path} created`));
                    }
                    else {
                        console.log(chalk_1.default.red(`${path} could not be created`));
                    }
                });
            }
            else {
                console.log(chalk_1.default.red(`${path} already exists`));
            }
        });
    }
    /**
     * Method that lists the content of a directory
     * @param path path to the file
     */
    listDirectory(path) {
        fs_1.access(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`${path} does not exist`));
            }
            else {
                console.log(chalk_1.default.green(`${path} content: `));
                const ls = child_process_1.spawn('ls', ['-l', path]);
                ls.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(`${data}`));
                });
                ls.stdout.on('data', (data) => {
                    console.log(chalk_1.default.green(`${data}`));
                });
            }
        });
    }
    /**
     * Method that shows the content of a file
     * @param path path to the file
     */
    showContentFile(path) {
        fs_1.access(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`${path} does not exist`));
            }
            else {
                console.log(chalk_1.default.green(`File ${path} exists. It contains: `));
                const content = fs.readFileSync(path, 'utf8');
                console.log(chalk_1.default.green(`${content}`));
            }
        });
    }
    /**
     * Method that deletes a file or a directory
     * @param path path to the file
     */
    deleteFileAndDirectory(path) {
        fs_1.access(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`${path} does not exist`));
            }
            else {
                const rm = child_process_1.spawn('rm', ['-rf', path]);
                rm.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(`${data}`));
                });
                rm.on('close', (code) => {
                    console.log(chalk_1.default.green(`${path} has been deleted`));
                });
            }
        });
    }
    /**
     * Method that moves a file or a directory to a new location
     * @param path old path
     * @param newPath new path
     */
    moveAndCopy(path, newPath) {
        fs_1.access(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`${path} does not exist`));
            }
            else {
                const mv = child_process_1.spawn('mv', [path, newPath]);
                mv.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(`${data}`));
                });
                mv.on('close', (code) => {
                    console.log(chalk_1.default.green(`${path} has been moved to ${newPath}`));
                });
            }
        });
    }
}
exports.Wrapper = Wrapper;
