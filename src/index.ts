import express, { Request, Response } from 'express';
import { v1 } from 'uuid';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const ADMIN_ID = '0';
const ADMIN_NAME = 'Olga';
const POST_ID = '0';

let bloggers = [
  {
    id: ADMIN_ID,
    name: ADMIN_NAME,
    youtubeUrl: 'https://www.youtube.com/channel/UC1_6nRWugDv_B6icoZtHDDw',
  },
];

let posts = [
  {
    id: POST_ID,
    title: 'Обед',
    shortDescription: 'Кушал чепубели',
    content: 'было вкусно',
    bloggerId: ADMIN_ID,
    bloggerName: ADMIN_NAME,
  },
];

app.get('/api/bloggers', (req: Request, res: Response) => {
  res.send(bloggers);
});

app.get('/api/bloggers/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const user = bloggers.find((user) => user.id === id);

  res.send(user ?? 404);
});

app.put('/api/bloggers/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let flag = false;

  type RequiredFields = 'name' | 'youtubeUrl' | 'id';

  const responseBody: ResponseBodyType<RequiredFields> = {
    data: {},
    errorsMessages: [],
    resultCode: 1,
  };

  const errorBodyConstructor = (message: string, field: RequiredFields) => {
    responseBody.errorsMessages.push({
      message,
      field,
    });
    flag = true;
  };

  const user = bloggers.find((user) => user.id === id);

  if (!req.body.name) errorBodyConstructor('The Name field is required.', 'name');
  if (!req.body.youtubeUrl) errorBodyConstructor('The YoutubeUrl field is required.', 'youtubeUrl');
  if (!user) errorBodyConstructor('User not found', 'id');

  if (flag) {
    res.status(400).send(responseBody);
    return;
  }

  if (user && req.body.name && req.body.youtubeUrl) {
    user.name = req.body.name;
    user.youtubeUrl = req.body.youtubeUrl;
    res.send(204);
  }
});

app.post('/api/bloggers', (req: Request, res: Response) => {
  let flag = false;

  type RequiredFields = 'name' | 'youtubeUrl';

  const responseBody: ResponseBodyType<RequiredFields> = {
    data: {},
    errorsMessages: [],
    resultCode: 1,
  };

  const errorBodyConstructor = (message: string, field: RequiredFields) => {
    responseBody.errorsMessages.push({
      message,
      field,
    });
    flag = true;
  };

  if (!req.body.name) errorBodyConstructor('The Name field is required.', 'name');
  if (!req.body.youtubeUrl) errorBodyConstructor('The YoutubeUrl field is required.', 'youtubeUrl');

  if (flag) {
    res.status(400).send(responseBody);
    return;
  }

  const newBlogger = {
    id: v1(),
    name: req.body.name,
    youtubeUrl: req.body.youtubeUrl,
  };

  bloggers.push(newBlogger);
  res.status(201).send(newBlogger);
});

app.delete('/api/bloggers/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const index = bloggers.findIndex((item) => item.id === id);

  if (index !== -1) {
    bloggers.splice(index, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});

app.get('/api/posts', (req: Request, res: Response) => {
  res.send(posts);
});

app.get('/api/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const post = posts.find((post) => post.id === id);

  res.send(post ?? 404);
});

app.put('/api/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let flag = false;

  type RequiredFields = 'title' | 'shortDescription' | 'content' | 'bloggerId' | 'id';

  const responseBody: ResponseBodyType<RequiredFields> = {
    data: {},
    errorsMessages: [],
    resultCode: 1,
  };

  const errorBodyConstructor = (message: string, field: RequiredFields) => {
    responseBody.errorsMessages.push({
      message,
      field,
    });
    flag = true;
  };

  const post = posts.find((post) => post.id === id);

  if (!req.body.title) errorBodyConstructor('The Title field is required.', 'title');
  if (!req.body.shortDescription) errorBodyConstructor('The ShortDescription field is required.', 'shortDescription');
  if (!req.body.content) errorBodyConstructor('The Content field is required.', 'content');
  if (!req.body.bloggerId && req.body.bloggerId !== 0) {
    errorBodyConstructor('The BloggerId field is required.', 'bloggerId');
  }
  if (!post) errorBodyConstructor('Post not found', 'id');

  if (flag) {
    res.status(400).send(responseBody);
    return;
  }

  if (post && req.body.title && req.body.shortDescription && req.body.content) {
    post.title = req.body.title;
    post.shortDescription = req.body.shortDescription;
    post.content = req.body.content;
    post.bloggerId = id;
    res.sendStatus(204);
  }
});

app.post('/api/posts', (req: Request, res: Response) => {
  let flag = false;

  type RequiredFields = 'title' | 'shortDescription' | 'content' | 'bloggerId';

  const responseBody: ResponseBodyType<RequiredFields> = {
    data: {},
    errorsMessages: [],
    resultCode: 1,
  };

  const errorBodyConstructor = (message: string, field: RequiredFields) => {
    responseBody.errorsMessages.push({
      message,
      field,
    });
    flag = true;
  };

  if (!req.body.title) errorBodyConstructor('The Title field is required.', 'title');
  if (!req.body.shortDescription) errorBodyConstructor('The ShortDescription field is required.', 'shortDescription');
  if (!req.body.content) errorBodyConstructor('The Content field is required.', 'content');
  if (!req.body.bloggerId && req.body.bloggerId !== 0) {
    errorBodyConstructor('The BloggerId field is required.', 'bloggerId');
  }

  if (req.body.bloggerId) {
    const user = bloggers.find((item) => item.id === req.body.bloggerId);
    if (!user) {
      errorBodyConstructor("Invalid 'bloggerId': such blogger doesn't exist", 'bloggerId');
    }
  }

  if (flag) {
    res.status(400).send(responseBody);
    return;
  }

  const newPost = {
    id: v1(),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    bloggerId: req.body.bloggerId,
    bloggerName: bloggers.find((item) => item.id === req.body.bloggerId)!.name,
  };
  posts.push(newPost);
  res.status(201).send(newPost);
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const index = posts.findIndex((item) => item.id === id);

  if (index !== -1) {
    posts.splice(index, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

type ResponseBodyType<T = string> = {
  data: Object;
  errorsMessages: { message: string; field: T }[];
  resultCode: number;
};
