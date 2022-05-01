import chalk from 'chalk';
import {spawn} from 'child_process';
import * as fs from 'fs';

/**
 * @description Class that searches for a word in a file
 * @var {string} fileName - File to search in
 * @var {string} wordToSearch - Word to search for
 */
export class CatApp {
  constructor(private fileName: string, private wordToSearch: string) {
    this.fileName = fileName;
    this.wordToSearch = wordToSearch;
  }
  /**
   * @description This method will search for the word in the file without using pipes
   */
  public withoutPipe() {
    const outputCount:string[]= [];
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`The file ${this.fileName} does not exist`));
      } else {
        const cat = spawn('cat', [this.fileName]);
        cat.stdout.on('data', (data) => {
          outputCount.push(data.toString());
        });
        cat.stderr.on('data', (data) => {
          console.log(chalk.red(data.toString()));
        });
        cat.on('close', (code) => {
          console.log(chalk.green(`The file ${this.fileName} has been read successfully`));
          console.log(chalk.green(`The word ${this.wordToSearch} appears ${outputCount.join('').split(this.wordToSearch).length - 1} times`));
        });
      }
    });
  }
  /**
   * @description This method will search for the word in the file using pipes
   */
  public withPipe() {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`The file ${this.fileName} does not exist`));
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', ['-c', this.wordToSearch]);
        cat.stdout.pipe(grep.stdin);
        cat.stderr.on('data', (data) => {
          console.log(chalk.red(data.toString()));
        });
        cat.on('close', (code) => {
          console.log(chalk.green(`The file ${this.fileName} has been read successfully`));
          console.log(chalk.green(`The word ${this.wordToSearch} appears the following times: `));
          grep.stdout.pipe(process.stdin);
        });
      }
    });
  }
}