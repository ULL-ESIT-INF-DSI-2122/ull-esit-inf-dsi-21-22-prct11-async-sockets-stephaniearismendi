import * as net from 'net';
import {MessageEventEmitterController} from './EventEmitterController';

import * as yargs from 'yargs';
import chalk from 'chalk';
import {RequestTypes} from './types';

/**
 * Aux function that prints a string in a color
 * @param color color of the note
 * @param cadena string to print
 */
function printColor(color:string, cadena:string):void {
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

const client = net.connect({port: 6060}); // default port
const socket = new MessageEventEmitterController(client);

/**
 * Type of the request.
 * @param {RequestTypes} request
 */
let _request:RequestTypes = {
  user: '',
  title: '',
  body: '',
  color: '',
  path: '',
  type: 'list',
};

/**
 * Checks if the given string is a valid color.
 * @param color - The color of the note.
 * @returns colorFinal - The color of the note.
 */
export function checkColor(color:string):string {
  const _colors: string[] = ['red', 'green', 'blue', 'yellow'];
  let colorFinal:string = '';
  for (let i: number = 0; i < _colors.length; i++) {
    if (color === _colors[i]) {
      colorFinal = color;
      break;
    } else {
      colorFinal = 'red';
    }
  }
  return colorFinal;
}

// COMMANDS LIST

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
      console.log(chalk.green(`Adding note ${argv.title}`));
      let colorFinal:string = ' ';
      colorFinal = checkColor(argv.color);
      const newTitle:string = argv.title.replace(/\s/g, '-');
      _request = {
        user: argv.user,
        title: newTitle,
        body: argv.body,
        color: colorFinal,
        type: 'add',
      };
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
      const newTitle:string = argv.title.replace(/\s/g, '-');
      _request = {
        user: argv.user,
        title: newTitle,
        type: 'read',
      };
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
      _request = {
        user: argv.user,
        type: 'list',
      };
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
      const newTitle:string = argv.title.replace(/\s/g, '-');
      _request = {
        user: argv.user,
        title: newTitle,
        type: 'remove',
      };
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
      const newTitle:string = argv.title.replace(/\s/g, '-');
      let colorFinal:string = ' ';
      colorFinal = checkColor(argv.color);
      _request = {
        user: argv.user,
        title: newTitle,
        body: argv.body,
        color: colorFinal,
        type: 'modify',
      };
    }
  },
});

yargs.parse();

// SENDING REQUEST TO THE SERVER

/**
 * @description The client sends the request to the server
 */
client.write(JSON.stringify(_request) + '\n', (err:any) => {
  if (err) {
    console.log(chalk.red('Error: ' + err));
  } else {
    console.log(chalk.green('Request sent'));
  };
});

// RECEIVING RESPONSE FROM THE SERVER

/**
 * @description The socket receives the response from the server and prints it
 */
socket.on('message', (data) => {
  const aux:any = JSON.stringify(data);
  const response:any = JSON.parse(aux);
  if (response.state === 1) {
    if (response.type === 'add') {
      console.log(chalk.green(`Note ${response.title} added`));
    } else if (response.type === 'read') {
      console.log(chalk.green(`Note ${response.title} contains the following: `));
      printColor(response.color, response.body);
    } else if (response.type === 'list') {
      console.log(chalk.green(`List of notes for ${response.user}`));
      response.notes.forEach((note:any) => {
        console.log(chalk.green(`Title: ${note.title}`));
        console.log(chalk.green('-----------------------------------------------------'));
        printColor(note.color, note.body);
      },
      );
    } else if (response.type === 'remove') {
      console.log(chalk.green(`Note ${response.title} removed`));
    } else if (response.type === 'modify') {
      console.log(chalk.green(`Note ${response.title} modified`));
    }
  } else {
    console.log(chalk.red(`Error: ${response.error}`));
  }
  client.destroy(); // kill client after server's response
},
);

// CLOSING CONNECTIONS AND ERRORS

/**
 * @description Controls the closing of the socket
 */
socket.on('close', () => {
  console.log(chalk.red('Connection closed'));
});

/**
 * @description Checks if there is an error in the client
 */
client.on('error', (err:any) => {
  console.log(chalk.red('Error: ' + err));
});

/**
 * @description Checks if the connection close
 */
client.on('close', () => {
  console.log(chalk.red('Connection closed'));
});

