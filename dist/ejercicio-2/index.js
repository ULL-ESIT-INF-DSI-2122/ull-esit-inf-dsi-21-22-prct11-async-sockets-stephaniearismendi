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
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
const catApp_1 = require("./catApp");
/**
 * Use yargs to parse the command line arguments
 */
yargs.command({
    command: 'counter',
    describe: 'Displays how many times a word appears in a file',
    builder: {
        file: {
            describe: 'File to search in',
            demandOption: true,
            type: 'string',
        },
        word: {
            describe: 'Word to search for',
            demandOption: true,
            type: 'string',
        },
        pipe: {
            describe: 'Option to use pipes or not',
            demandOption: true,
            type: 'boolean',
        },
    },
    handler(argv) {
        if (typeof argv.file === 'string' && typeof argv.word === 'string' &&
            typeof argv.pipe === 'boolean') {
            const cat = new catApp_1.CatApp(argv.file, argv.word);
            if (argv.pipe) {
                cat.withPipe();
            }
            else {
                cat.withoutPipe();
            }
        }
        else {
            console.log('The arguments are not valid');
        }
    },
});
yargs.parse();
