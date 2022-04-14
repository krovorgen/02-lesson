import express from 'express';
import cors from 'cors';
import { bloggersRouter } from './routes/bloggers-router';
import { postsRouter } from './routes/posts-router';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.use('/api/bloggers', bloggersRouter);
app.use('/api/posts', postsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
