"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const watcher_1 = require("./watcher");
/**
 * Recibe por commandos los argumentos y comprueba si el fichero existe
 */
if (process.argv.length < 3) {
    console.log('Please, specify a file');
}
else {
    const filename = process.argv[2];
    const commands = [];
    for (let i = 0; i < process.argv.length; i++) {
        if (i >= 3) {
            commands.push(process.argv[i]);
        }
    }
    fs_1.access(filename, fs_1.constants.F_OK, (err) => {
        if (err) {
            console.log(`File ${filename} does not exist`);
        }
        else {
            const watch = new watcher_1.Watcher(commands);
            watch.init();
        }
    });
}
