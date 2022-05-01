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
const wrapper_1 = require("./wrapper");
const yargs = __importStar(require("yargs"));
/**
 * Command that lists all the notes of a user
 */
yargs.command({
    command: 'type',
    describe: 'checks if a path is a file or a directory',
    builder: {
        path: {
            describe: 'path to check',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.checkIfDirectory(argv.path);
        }
    },
});
/**
 * command that creates a directory
 */
yargs.command({
    command: 'create-directory',
    describe: 'creates a directory',
    builder: {
        path: {
            describe: 'directory path to create',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.createDirectory(argv.path);
        }
    },
});
/**
 * command that lists all the files of a directory
 */
yargs.command({
    command: 'list',
    describe: 'lists the content of a directory',
    builder: {
        path: {
            describe: 'directory path to list',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.listDirectory(argv.path);
        }
    },
});
/**
 * Command that shows the content of a file
 */
yargs.command({
    command: 'show',
    describe: 'shows the content of a file',
    builder: {
        path: {
            describe: 'path of the file to show',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.showContentFile(argv.path);
        }
    },
});
/**
 * Command that deletes a file or directory
 */
yargs.command({
    command: 'remove',
    describe: 'delete a file or a directory',
    builder: {
        path: {
            describe: 'path of the file or directory to delete',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.deleteFileAndDirectory(argv.path);
        }
    },
});
/**
 * Command that moves a file or directory
 */
yargs.command({
    command: 'move',
    describe: 'move a file or a directory to another',
    builder: {
        path: {
            describe: 'path of the file or directory to move',
            demandOption: true,
            type: 'string',
        },
        newPath: {
            describe: 'new path of the file or directory',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.path === 'string' && typeof argv.newPath === 'string') {
            const wrapper = new wrapper_1.Wrapper();
            wrapper.moveAndCopy(argv.path, argv.newPath);
        }
    },
});
yargs.parse();
