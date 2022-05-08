import * as fs from 'fs';
import {ResponseTypes} from './types';
import {NotesType} from './types';

/**
 * Class establishing the pattern that each note will follow
 */
export class Notes {
    private _path:string = ' ';
    private _response:ResponseTypes = {
      user: '',
      state: 0,
      type: 'list',
    };
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
    public createNote(user:string, title:string, body:string, color:string):ResponseTypes {
      this.setPath(user);
      this.createFolder();
      const filepath = `${this._path}/${title}.json`;
      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify({
          title: title,
          body: body,
          color: color,
        }));
        this._response = {
          user: user,
          state: 1,
          type: 'add',
          title: title,
          body: body,
          color: color,
        };
      } else {
        this._response = {
          user: user,
          state: 0,
          type: 'add',
          title: title,
          body: body,
          color: color,
          error: 'The note already exists.',
        };
      }
      return this._response;
    }
    /**
     * Method that searches for a note and prints it
     */
    public readNote(user:string, title:string):ResponseTypes {
      this.setPath(user);
      const notePath:string = this._path + '/' + title + '.json';
      if (fs.existsSync(notePath)) {
        const nota:any = this.readJSON(notePath);
        const body = nota.body;
        const color = nota.color;
        this._response = {
          state: 1,
          type: 'read',
          title: title,
          body: body,
          color: color,
        };
      } else {
        this._response = {
          state: 0,
          type: 'read',
          title: title,
          error: 'The note does not exist.',
        };
      }
      return this._response;
    }
    /**
     * Method that lists all the notes of a user
     * @param user name of the user
     */
    public listNotes(user:string):ResponseTypes {
      const Notes:NotesType[] = [];
      this.setPath(user);
      if (fs.existsSync(this._path)) {
        const notasDir = fs.readdirSync(this._path);
        if (notasDir.length > 0) {
          for (let i:number = 0; i < notasDir.length; i++) {
            const nota = this.readJSON(this._path + '/' + notasDir[i]);
            const title = nota.title;
            const color = nota.color;
            Notes.push({
              title: title,
              color: color,
              body: nota.body,
            });
          }
          this._response = {
            state: 1,
            type: 'list',
            notes: Notes,
          };
        } else {
          this._response = {
            state: 0,
            type: 'list',
            error: 'No notes to show.',
          };
        }
      } else {
        this._response = {
          state: 0,
          type: 'list',
          error: `User ${user} have not created any note yet.`,
        };
      }
      return this._response;
    }
    /**
     * Method that deletes a note
     * @param user name of the user
     * @param title title of the note
     */
    public deleteNote(user:string, title:string):ResponseTypes {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        fs.unlinkSync(this._path + '/' + title + '.json');
        this._response = {
          state: 1,
          type: 'remove',
          title: title,
        };
      } else {
        this._response = {
          state: 0,
          type: 'remove',
          title: title,
          error: 'The note does not exist.',
        };
      }
      return this._response;
    }
    /**
     * Method that updates a note
     * @param user name of the user
     * @param title title of the note
     * @param body new body of the note
     * @param color new color of the note
     */
    public editNote(user:string, title:string, body:string, color:string):ResponseTypes {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        const nota:any = this.readJSON(this._path + '/' + title + '.json');
        nota.body = body;
        nota.color = color;
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify(nota));
        this._response = {
          state: 1,
          type: 'modify',
          title: title,
        };
      } else {
        this._response = {
          state: 0,
          type: 'modify',
          error: 'You cannot edit a note that does not exist.',
        };
      }
      return this._response;
    }
}