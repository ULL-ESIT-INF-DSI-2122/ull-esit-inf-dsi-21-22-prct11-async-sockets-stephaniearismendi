import chalk from 'chalk';
import {access, watch} from 'fs';
import * as fs from 'fs';

/**
 * Function that checks the changes on a directory. It will show a message if:
 * - a file is created
 * - a file is deleted
 * - a file is modified
 * - a file is renamed
 * @param user name of the user
 * @param path path of the directory
 */
export function monitor(user:string, path:string) {
  path = path + '/' + user;
  let numFicheros:number = 0;
  let oldNamefile:string = '';
  if (fs.readdirSync(path)) {
    numFicheros = fs.readdirSync(path).length;
  }
  access(path, (err) => {
    if (err) {
      console.log(chalk.red(`User ${user} doesn't have access to ${path}`));
    } else {
      watch(path, (eventType, filename) => {
        if (eventType == 'rename') {
          if (fs.readdirSync(path) && fs.readdirSync(path).length > numFicheros) {
            console.log(chalk.green(`User ${user} has added ${filename}`));
            numFicheros = fs.readdirSync(path).length;
          } else if (fs.readdirSync(path) && fs.readdirSync(path).length < numFicheros) {
            console.log(chalk.red(`User ${user} has deleted ${filename}`));
            numFicheros = fs.readdirSync(path).length;
          } else if (fs.existsSync(path + '/' + filename)) {
            console.log(chalk.yellow(`User ${user} has changed the name of ${oldNamefile} to ${filename}`));
          } else if (!fs.existsSync(path + '/' + filename)) {
            oldNamefile = filename;
          }
        } else if (eventType == 'change') {
          console.log(chalk.yellow(`User ${user} has changed the content of the file ${filename}`));
        }
      },
      );
    }
  });
}