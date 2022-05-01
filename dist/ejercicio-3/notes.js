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
exports.Notes = void 0;
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * Class establishing the pattern that each note will follow
 */
class Notes {
    constructor() {
        this._path = ' ';
    }
    /**
     * Path Setter
     */
    setPath(user) {
        this._path = `./Notas/${user}`;
    }
    /**
     * Method that creates a directory to store the notes
     * of each user. First check if the directory already exists.
     */
    createFolder() {
        if (!fs.existsSync(this._path)) {
            fs.mkdirSync(this._path, { recursive: true });
        }
    }
    /**
     * Method that reads a JSON file and returns the content
     */
    readJSON(path) {
        const nota = JSON.parse(fs.readFileSync(path, 'utf8'));
        return nota;
    }
    /**
     * Method that creates a note
     * @param user name of the user
     * @param title title of the note
     * @param body body of the note
     * @param color color of the note
     */
    createNote(user, title, body, color) {
        this.setPath(user);
        this.createFolder();
        const filepath = `${this._path}/${title}.json`;
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify({
                title: title,
                body: body,
                color: color,
            }));
            console.log(chalk_1.default.green(`The note ${title} has been successfully created.`));
            return 1;
        }
        else {
            console.log(chalk_1.default.red(`The note ${title} already exists.`));
            return 0;
        }
    }
    /**
     * Auxiliary method that performs the task
     * of printing a string with the chosen color.
     * @param color selected color
     * @param cadena string to print
     */
    printColor(color, cadena) {
        if (color === 'red') {
            console.log(chalk_1.default.red(cadena));
        }
        else if (color === 'green') {
            console.log(chalk_1.default.green(cadena));
        }
        else if (color === 'blue') {
            console.log(chalk_1.default.blue(cadena));
        }
        else if (color === 'yellow') {
            console.log(chalk_1.default.yellow(cadena));
        }
    }
    /**
     * Method that searches for a note and prints it
     */
    readNote(user, title) {
        this.setPath(user);
        const notePath = this._path + '/' + title + '.json';
        if (fs.existsSync(notePath)) {
            const nota = this.readJSON(notePath);
            const body = nota.body;
            const color = nota.color;
            console.log(chalk_1.default.green(`The note ${title} contains the following content: `));
            this.printColor(color, body);
            return 1;
        }
        else {
            console.log(chalk_1.default.red('The note does not exist.'));
            return 0;
        }
    }
    /**
     * Method that lists all the notes of a user
     * @param user name of the user
     */
    listNotes(user) {
        this.setPath(user);
        if (fs.existsSync(this._path)) {
            const notasDir = fs.readdirSync(this._path);
            if (notasDir.length > 0) {
                console.log(chalk_1.default.green('The notes are listed below: '));
                for (let i = 0; i < notasDir.length; i++) {
                    const nota = this.readJSON(this._path + '/' + notasDir[i]);
                    const title = nota.title;
                    const color = nota.color;
                    this.printColor(color, title);
                }
                return 1;
            }
            else {
                console.log(chalk_1.default.red('No notes to show.'));
                return 0;
            }
        }
        else {
            console.log(chalk_1.default.red(`User ${user} have not created any note yet.`));
            return 0;
        }
    }
    /**
     * Method that deletes a note
     * @param user name of the user
     * @param title title of the note
     */
    deleteNote(user, title) {
        this.setPath(user);
        if (fs.existsSync(this._path + '/' + title + '.json')) {
            fs.unlinkSync(this._path + '/' + title + '.json');
            console.log(chalk_1.default.green(`The note ${title} has been removed successfully.`));
            return 1;
        }
        else {
            console.log(chalk_1.default.red('You cannot delete a note that does not exist.'));
            return 0;
        }
    }
    /**
     * Method that updates a note
     * @param user name of the user
     * @param title title of the note
     * @param body new body of the note
     * @param color new color of the note
     */
    editNote(user, title, body, color) {
        this.setPath(user);
        if (fs.existsSync(this._path + '/' + title + '.json')) {
            const nota = this.readJSON(this._path + '/' + title + '.json');
            nota.body = body;
            nota.color = color;
            fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify(nota));
            console.log(chalk_1.default.green(`The note ${title} has been edited successfully.`));
            return 1;
        }
        else {
            console.log(chalk_1.default.red('You cannot edit a note that does not exist.'));
            return 0;
        }
    }
}
exports.Notes = Notes;
