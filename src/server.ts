import {EventEmitter} from 'events';
import {MessageEventEmitterController} from './EventEmitterController';
import * as net from 'net';
import chalk from 'chalk';
import {ResponseTypes} from './types';
import {Notes} from './NotesApp';

/**
 * Class for handling socket events. It holds the server socket.
 * @variable _port - Port number.
 * @class MessageEventEmitterController
 * @extends EventEmitter
 */
export class MessageEventEmitterServer extends EventEmitter {
  private _port:number;
  private _response:ResponseTypes = {
    user: '',
    state: 0,
    type: 'list',
  };
  /**
   * The constructor receives the port number and creates the server socket. It switches between the different commands and executes the corresponding function.
   * Then, it sends the response to the client.
   * @param port - Port number.
   */
  constructor(port?:number) {
    super();
    this._port = port || 6060;
    const Nota = new Notes();
    const server = net.createServer((socket) => {
      console.log(chalk.green('Connection established'));
      const socketController = new MessageEventEmitterController(socket);
      socketController.on('message', (message) => {
        const request = message;
        console.log(chalk.green(`Received request.`));
        switch (request.type) {
          case 'add':
            console.log(chalk.green(`Adding note.`));
            this._response = Nota.createNote(request.user, request.title, request.body, request.color);
            break;
          case 'read':
            console.log(chalk.green(`Reading note.`));
            this._response = Nota.readNote(request.user, request.title);
            break;
          case 'list':
            console.log(chalk.green(`Listing notes.`));
            this._response = Nota.listNotes(request.user);
            break;
          case 'remove':
            console.log(chalk.green(`Removing note.`));
            this._response = Nota.deleteNote(request.user, request.title);
            break;
          case 'modify':
            console.log(chalk.green(`Modifying note.`));
            this._response = Nota.editNote(request.user, request.title, request.body, request.color);
            break;
          default:
            console.log(chalk.red(`Error: Unknown request type.`));
            this._response.state = 0;
            this._response.error = 'Unknown request type.';
            break;
        }
        socket.write(JSON.stringify(this._response) + '\n', (err:any) => {
          if (err) {
            console.log(chalk.red('Error: ' + err));
          } else {
            console.log(chalk.green('Response sent'));
          }
        });
        socket.on('close', () => {
          console.log(chalk.green('Connection closed'));
        });
      });
    });
    server.listen(this._port, () => {
      console.log(chalk.green(`Server listening on port ${this._port}.`));
    });
  }
}

new MessageEventEmitterServer(6060);