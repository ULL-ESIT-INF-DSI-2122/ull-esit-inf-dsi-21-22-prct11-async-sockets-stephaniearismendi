import * as yargs from 'yargs';
import {CatApp} from './catApp';

/**
 * Use yargs to parse the command line arguments
 */
yargs.command({
  command: 'counter',
  describe: 'Displays how many times a word appears in a file',
  builder: {
    file: {
      describe: 'File to search in',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Word to search for',
      demandOption: true,
      type: 'string',
    },
    pipe: {
      describe: 'Option to use pipes or not',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' &&
          typeof argv.pipe === 'boolean') {
      const cat = new CatApp(argv.file, argv.word);
      if (argv.pipe) {
        cat.withPipe();
      } else {
        cat.withoutPipe();
      }
    } else {
      console.log('The arguments are not valid');
    }
  },
});

yargs.parse();
