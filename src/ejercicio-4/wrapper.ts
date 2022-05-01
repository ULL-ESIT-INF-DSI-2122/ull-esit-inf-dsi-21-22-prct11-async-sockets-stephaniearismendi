import {spawn} from 'child_process';
import {access, constants} from 'fs';
import chalk from 'chalk';
import * as fs from 'fs';

export class Wrapper {
  constructor() {
  }
  /**
   * Method that checks if path is a file or a directory
   * @param path path to analyze
   * @returns true if the path is a directory, false otherwise
   */
  public checkIfDirectory(path:string):boolean {
    let isDirectory:boolean = false;
    if (fs.existsSync(path)) {
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        isDirectory = true;
        console.log(chalk.green(`${path} is a directory`));
      } else if (stats.isFile()) {
        isDirectory = false;
        console.log(chalk.green(`${path} is a file`));
      }
    } else {
      console.log(chalk.red(`${path} does not exist`));
    }
    return isDirectory;
  }
  /**
   * Method that creates a directory
   * @param path path to the new directory
   */
  public createDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        const mkdir = spawn('mkdir', ['-p', path]);
        mkdir.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        mkdir.on('close', (code) => {
          if (code === 0) {
            console.log(chalk.green(`${path} created`));
          } else {
            console.log(chalk.red(`${path} could not be created`));
          }
        });
      } else {
        console.log(chalk.red(`${path} already exists`));
      }
    });
  }

  /**
   * Method that lists the content of a directory
   * @param path path to the file
   */

  public listDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        console.log(chalk.green(`${path} content: `));
        const ls = spawn('ls', ['-l', path]);
        ls.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        ls.stdout.on('data', (data) => {
          console.log(chalk.green(`${data}`));
        });
      }
    });
  }

  /**
   * Method that shows the content of a file
   * @param path path to the file
   */
  public showContentFile(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        console.log(chalk.green(`File ${path} exists. It contains: `));
        const content = fs.readFileSync(path, 'utf8');
        console.log(chalk.green(`${content}`));
      }
    });
  }
  /**
   * Method that deletes a file or a directory
   * @param path path to the file
   */
  public deleteFileAndDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        const rm = spawn('rm', ['-rf', path]);
        rm.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        rm.on('close', (code) => {
          console.log(chalk.green(`${path} has been deleted`));
        });
      }
    });
  }
  /**
   * Method that moves a file or a directory to a new location
   * @param path old path
   * @param newPath new path
   */
  public moveAndCopy(path:string, newPath:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        const mv = spawn('mv', [path, newPath]);
        mv.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        mv.on('close', (code) => {
          console.log(chalk.green(`${path} has been moved to ${newPath}`));
        });
      }
    });
  }
}