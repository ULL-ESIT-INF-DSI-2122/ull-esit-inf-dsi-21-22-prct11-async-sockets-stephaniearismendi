import {expect} from 'chai';
import 'mocha';
import {EventEmitter} from 'events';
import {MessageEventEmitterController} from '../src/EventEmitterController';

describe('Tests EventEmitterController Methods', () => {
  it('There must be a class EventEmitterController', () => {
    expect(MessageEventEmitterController).to.exist;
  });
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterController(socket);
    client.on('message', (message) => {
      expect(message).to.be.eql({'type': 'change', 'prev': 13, 'curr': 26});
      done();
    });

    socket.emit('data', '{"type": "change", "prev": 13');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
  });
});