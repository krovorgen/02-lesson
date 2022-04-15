import { bloggers } from '../repositories/bloggers-repository';
import { NextFunction, Request, Response } from 'express';

export const bloggerExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let bloggerId: string;
  if (req.params.bloggerId) {
    bloggerId = req.params.bloggerId;
  }
  if (req.params.bloggerId) {
    bloggerId = req.body.bloggerId;
  }
  // @ts-ignore
  if (bloggerId === undefined) {
    next();
  }
  const isFounded = bloggers.find((user) => user.id === +bloggerId);
  if (!isFounded) {
    res.sendStatus(404).send('This blogger not found');
  } else {
    next();
  }
};
