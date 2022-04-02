import express, { Request, Response } from 'express';
import { v1 } from 'uuid';
const app = express();
const port = 5000;

const idFirstUser = v1();
const idSecondUser = v1();
const idThirdUser = v1();

let bloggers = [
  {
    id: idFirstUser,
    name: 'string',
    youtubeUrl: 'string',
  },
  {
    id: idSecondUser,
    name: 'string',
    youtubeUrl: 'string',
  },
  {
    id: idThirdUser,
    name: 'string',
    youtubeUrl: 'string',
  },
];

app.get('/bloggers', (req: Request, res: Response) => {
  res.send(bloggers);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
