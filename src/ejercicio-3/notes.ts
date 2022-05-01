import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Class establishing the pattern that each note will follow
 */
export class Notes {
    private _path:string = ' ';
    constructor() {
    }
    /**
     * Path Setter
     */
    private setPath(user:string):void {
      this._path = `./Notas/${user}`;
    }
    /**
     * Method that creates a directory to store the notes
     * of each user. First check if the directory already exists.
     */
    private createFolder() {
      if (!fs.existsSync(this._path)) {
        fs.mkdirSync(this._path, {recursive: true});
      }
    }
    /**
     * Method that reads a JSON file and returns the content
     */
    private readJSON(path:string):any {
      const nota:any = JSON.parse(fs.readFileSync(path, 'utf8'));
      return nota;
    }
    /**
     * Method that creates a note
     * @param user name of the user
     * @param title title of the note
     * @param body body of the note
     * @param color color of the note
     */
    public createNote(user:string, title:string, body:string, color:string):number {
      this.setPath(user);
      this.createFolder();
      const filepath = `${this._path}/${title}.json`;
      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify({
          title: title,
          body: body,
          color: color,
        }));
        console.log(chalk.green(`The note ${title} has been successfully created.`));
        return 1;
      } else {
        console.log(chalk.red(`The note ${title} already exists.`));
        return 0;
      }
    }
    /**
     * Auxiliary method that performs the task
     * of printing a string with the chosen color.
     * @param color selected color
     * @param cadena string to print
     */
    private printColor(color:string, cadena:string) {
      if (color === 'red') {
        console.log(chalk.red(cadena));
      } else if (color === 'green') {
        console.log(chalk.green(cadena));
      } else if (color === 'blue') {
        console.log(chalk.blue(cadena));
      } else if (color === 'yellow') {
        console.log(chalk.yellow(cadena));
      }
    }
    /**
     * Method that searches for a note and prints it
     */
    public readNote(user:string, title:string):number {
      this.setPath(user);
      const notePath:string = this._path + '/' + title + '.json';
      if (fs.existsSync(notePath)) {
        const nota:any = this.readJSON(notePath);
        const body = nota.body;
        const color = nota.color;
        console.log(chalk.green(`The note ${title} contains the following content: `));
        this.printColor(color, body);
        return 1;
      } else {
        console.log(chalk.red('The note does not exist.'));
        return 0;
      }
    }
    /**
     * Method that lists all the notes of a user
     * @param user name of the user
     */
    public listNotes(user:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path)) {
        const notasDir = fs.readdirSync(this._path);
        if (notasDir.length > 0) {
          console.log(chalk.green('The notes are listed below: '));
          for (let i:number = 0; i < notasDir.length; i++) {
            const nota = this.readJSON(this._path + '/' + notasDir[i]);
            const title = nota.title;
            const color = nota.color;
            this.printColor(color, title);
          }
          return 1;
        } else {
          console.log(chalk.red('No notes to show.'));
          return 0;
        }
      } else {
        console.log(chalk.red(`User ${user} have not created any note yet.`));
        return 0;
      }
    }
    /**
     * Method that deletes a note
     * @param user name of the user
     * @param title title of the note
     */
    public deleteNote(user:string, title:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        fs.unlinkSync(this._path + '/' + title + '.json');
        console.log(chalk.green(`The note ${title} has been removed successfully.`));
        return 1;
      } else {
        console.log(chalk.red('You cannot delete a note that does not exist.'));
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
    public editNote(user:string, title:string, body:string, color:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        const nota:any = this.readJSON(this._path + '/' + title + '.json');
        nota.body = body;
        nota.color = color;
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify(nota));
        console.log(chalk.green(`The note ${title} has been edited successfully.`));
        return 1;
      } else {
        console.log(chalk.red('You cannot edit a note that does not exist.'));
        return 0;
      }
    }
}