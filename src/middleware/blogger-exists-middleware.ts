import { bloggers } from '../repositories/bloggers-repository';
import { NextFunction, Request, Response } from 'express';

export const bloggerExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let bloggerId: string;
  if (req.params.bloggerId) {
    bloggerId = req.params.bloggerId;
  } else {
    bloggerId = req.body.bloggerId;
  }
  const isFounded = bloggers.find((user) => user.id === +bloggerId);
  if (!isFounded) {
    res.sendStatus(400).send('This blogger not found');
  } else {
    next();
  }
};
