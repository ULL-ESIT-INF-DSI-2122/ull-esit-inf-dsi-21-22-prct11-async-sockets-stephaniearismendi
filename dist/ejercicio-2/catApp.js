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
exports.CatApp = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
/**
 * @description Class that searches for a word in a file
 * @var {string} fileName - File to search in
 * @var {string} wordToSearch - Word to search for
 */
class CatApp {
    constructor(fileName, wordToSearch) {
        this.fileName = fileName;
        this.wordToSearch = wordToSearch;
        this.fileName = fileName;
        this.wordToSearch = wordToSearch;
    }
    /**
     * @description This method will search for the word in the file without using pipes
     */
    withoutPipe() {
        const outputCount = [];
        fs.access(this.fileName, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`The file ${this.fileName} does not exist`));
            }
            else {
                const cat = child_process_1.spawn('cat', [this.fileName]);
                cat.stdout.on('data', (data) => {
                    outputCount.push(data.toString());
                });
                cat.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(data.toString()));
                });
                cat.on('close', (code) => {
                    console.log(chalk_1.default.green(`The file ${this.fileName} has been read successfully`));
                    console.log(chalk_1.default.green(`The word ${this.wordToSearch} appears ${outputCount.join('').split(this.wordToSearch).length - 1} times`));
                });
            }
        });
    }
    /**
     * @description This method will search for the word in the file using pipes
     */
    withPipe() {
        fs.access(this.fileName, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(chalk_1.default.red(`The file ${this.fileName} does not exist`));
            }
            else {
                const cat = child_process_1.spawn('cat', [this.fileName]);
                const grep = child_process_1.spawn('grep', ['-c', this.wordToSearch]);
                cat.stdout.pipe(grep.stdin);
                cat.stderr.on('data', (data) => {
                    console.log(chalk_1.default.red(data.toString()));
                });
                cat.on('close', (code) => {
                    console.log(chalk_1.default.green(`The file ${this.fileName} has been read successfully`));
                    console.log(chalk_1.default.green(`The word ${this.wordToSearch} appears the following times: `));
                    grep.stdout.pipe(process.stdin);
                });
            }
        });
    }
}
exports.CatApp = CatApp;
