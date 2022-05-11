import {ResponseType} from './types';
import {spawn} from 'child_process';

/**
 * Class that implements the execCommand function. IT executes a command and returns the output.
 * @param command Command to be executed.
 * @param args arguments to be passed to the command.
 * @param cb callback function that receives the output of the command.
 */
export const execCommand = (command: string, args: string, cb:(err: ResponseType|undefined, res: ResponseType | undefined) => void) => {
  let exe = spawn(command);
  if (args) {
    exe = spawn(command, args.split(' '));
  }
  let result:string = '';
  let error:boolean = false;
  exe.stdout.on('data', (data) => {
    result += data.toString();
  });
  exe.stderr.on('data', (data) => {
    result += data.toString();
    error = true;
  });
  exe.on('close', () => {
    if (!error) {
      cb(undefined,
          {
            output: result,
            success: true,
          });
    } else {
      cb({
        output: result,
        success: false,
      }, undefined);
    }
  });
};