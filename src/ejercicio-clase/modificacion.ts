import {access, constants} from 'fs';
import {Watcher} from './watcher';

/**
 * Recibe por commandos los argumentos y comprueba si el fichero existe
 */
if (process.argv.length < 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];
  const commands:string[] = [];
  for (let i:number = 0; i < process.argv.length; i++) {
    if (i >= 3) {
      commands.push(process.argv[i]);
    }
  }
  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      const watch = new Watcher(commands);
      watch.init();
    }
  });
}