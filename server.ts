import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({});

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
  res.send('Hello World');
});

app.listen(3000, () => 'auto-deployer listening on port 3000');
