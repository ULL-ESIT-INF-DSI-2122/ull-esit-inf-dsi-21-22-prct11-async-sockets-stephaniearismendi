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
exports.monitor = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const fs = __importStar(require("fs"));
/**
 * Function that checks the changes on a directory. It will show a message if:
 * - a file is created
 * - a file is deleted
 * - a file is modified
 * - a file is renamed
 * @param user name of the user
 * @param path path of the directory
 */
function monitor(user, path) {
    path = path + '/' + user;
    let numFicheros = 0;
    let oldNamefile = '';
    if (fs.readdirSync(path)) {
        numFicheros = fs.readdirSync(path).length;
    }
    fs_1.access(path, (err) => {
        if (err) {
            console.log(chalk_1.default.red(`User ${user} doesn't have access to ${path}`));
        }
        else {
            fs_1.watch(path, (eventType, filename) => {
                if (eventType == 'rename') {
                    if (fs.readdirSync(path) && fs.readdirSync(path).length > numFicheros) {
                        console.log(chalk_1.default.green(`User ${user} has added ${filename}`));
                        numFicheros = fs.readdirSync(path).length;
                    }
                    else if (fs.readdirSync(path) && fs.readdirSync(path).length < numFicheros) {
                        console.log(chalk_1.default.red(`User ${user} has deleted ${filename}`));
                        numFicheros = fs.readdirSync(path).length;
                    }
                    else if (fs.existsSync(path + '/' + filename)) {
                        console.log(chalk_1.default.yellow(`User ${user} has changed the name of ${oldNamefile} to ${filename}`));
                    }
                    else if (!fs.existsSync(path + '/' + filename)) {
                        oldNamefile = filename;
                    }
                }
                else if (eventType == 'change') {
                    console.log(chalk_1.default.yellow(`User ${user} has changed the content of the file ${filename}`));
                }
            });
        }
    });
}
exports.monitor = monitor;
