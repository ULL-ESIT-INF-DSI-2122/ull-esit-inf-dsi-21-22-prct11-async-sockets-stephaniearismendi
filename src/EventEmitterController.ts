import {EventEmitter} from 'events';

/**
 * Class for handling socket events.
 * It receives the data on chunks and emits events.
 * @class MessageEventEmitterController
 * @extends EventEmitter
 */
export class MessageEventEmitterController extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
