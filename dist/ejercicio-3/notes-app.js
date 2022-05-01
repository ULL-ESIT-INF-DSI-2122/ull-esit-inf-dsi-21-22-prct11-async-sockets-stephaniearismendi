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
exports.checkColor = void 0;
const yargs = __importStar(require("yargs"));
const notes_1 = require("./notes");
const chalk_1 = __importDefault(require("chalk"));
const look_directory_1 = require("./look-directory");
const nota = new notes_1.Notes();
function checkColor(color) {
    const _colors = ['red', 'green', 'blue', 'yellow'];
    let colorFinal = '';
    for (let i = 0; i < _colors.length; i++) {
        if (color === _colors[i]) {
            colorFinal = color;
            break;
        }
        else {
            colorFinal = 'red';
        }
    }
    return colorFinal;
}
exports.checkColor = checkColor;
/**
 * Command to create a note
 * It checks if the color is valid, if not it defaults to red
 * It changes the tittle, if necessary, sustituting the spaces for dashes
 * @param user name of the user
 * @param title title of the note
 * @param body body of the note
 * @param color color of the note
 */
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        },
        user: {
            describe: 'User who writes the note',
            demandOption: true,
            type: 'string',
        },
        body: {
            describe: 'Note Body',
            demandOption: true,
            type: 'string',
        },
        color: {
            describe: 'Note Color',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
            console.log(chalk_1.default.green(`Adding note ${argv.title}`));
            let colorFinal = ' ';
            colorFinal = checkColor(argv.color);
            const newTitle = argv.title.replace(/\s/g, '-');
            nota.createNote(argv.user, newTitle, argv.body, colorFinal);
        }
    },
});
/**
 * Command to read a note
 * @param user name of the user
 * @param title title of the note
 * It replaces the spaces in the title with dashes
 */
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Title Note to read',
            demandOption: true,
            type: 'string',
        },
        user: {
            describe: 'User who owns the note',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string' && typeof argv.title === 'string') {
            const newTitle = argv.title.replace(/\s/g, '-');
            nota.readNote(argv.user, newTitle);
        }
    },
});
/**
 * Command that lists all the notes of a user
 * @param user name of the user
 */
yargs.command({
    command: 'list',
    describe: 'List all notes',
    builder: {
        user: {
            describe: 'User who owns the notes',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string') {
            nota.listNotes(argv.user);
        }
    },
});
/**
 * Method that deletes a note
 * @param user name of the user
 * @param title title of the note
 * It replaces the title of the note with a dash
 */
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Title Note to remove',
            demandOption: true,
            type: 'string',
        },
        user: {
            describe: 'User who owns the note',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string' && typeof argv.title === 'string') {
            const newTitle = argv.title.replace(/\s/g, '-');
            nota.deleteNote(argv.user, newTitle);
        }
    },
});
/**
 * @description Command to update a note
 * It checks if the user and title are valid, if so, it updates the note
 * If the color is not valid, it will be set to red
 * It changes the title to a new one, removing spaces and replacing them with dashes
 * @param user name of the user
 * @param title title of the note
 * @param body new body of the note
 * @param color new color of the note
 */
yargs.command({
    command: 'modify',
    describe: 'Edit a note',
    builder: {
        title: {
            describe: 'Title Note to edit',
            demandOption: true,
            type: 'string',
        },
        user: {
            describe: 'User who owns the note',
            demandOption: true,
            type: 'string',
        },
        body: {
            describe: 'New Note Body',
            demandOption: true,
            type: 'string',
        },
        color: {
            describe: 'New Note Color',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
            const newTitle = argv.title.replace(/\s/g, '-');
            let colorFinal = ' ';
            colorFinal = checkColor(argv.color);
            nota.editNote(argv.user, newTitle, argv.body, colorFinal);
        }
    },
});
/**
   * Command to ask for the user name and the directory path to monitor
   * @param user name of the user
   * @param path path of the directory
   */
yargs.command({
    command: 'monitor',
    describe: 'Monitors changes made to the specified directory',
    builder: {
        user: {
            describe: 'User we wants to monitor',
            demandOption: true,
            type: 'string',
        },
        path: {
            describe: 'path to the directory we want to monitor',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.user === 'string' && typeof argv.path === 'string') {
            console.log(chalk_1.default.green(`Monitoring changes in ${argv.path}`));
            look_directory_1.monitor(argv.user, argv.path);
        }
    },
});
yargs.parse();
