import { NextFunction, Request, Response } from 'express';
import { posts } from '../repositories/posts-repository';

export const postExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let postId: string;
  if (req.params.postId) {
    postId = req.params.postId;
  } else {
    postId = req.body.postId;
  }
  const isFounded = posts.find((user) => user.id === +postId);
  if (!isFounded) {
    res.sendStatus(404).send('This post not found');
  } else {
    next();
  }
};
