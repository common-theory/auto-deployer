import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({});
import child_process from 'child_process';

const app = express();

app.use(express.json());
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const secret = req.header('X-Hub-Signature');
  const digest = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
  if (secret !== `sha1=${digest}`) {
    next(new Error('Webhook secret mismatch'));
  } else {
    next();
  }
});
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  child_process.exec(`
    wget https://raw.githubusercontent.com/common-theory/infrastructure/master/docker-compose.yaml -O /tmp/docker-compose.yaml && \
    docker stack deploy --compose-file /tmp/docker-compose.yaml ctheory
    `, (err, stdout, stderr) => {
      if (err) {
        next(stderr);
      } else {
        res.send(stdout);
      }
    });
});

app.listen(3000, () => console.log('auto-deployer listening on port 3000'));
