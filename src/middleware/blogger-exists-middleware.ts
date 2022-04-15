import { bloggers } from '../repositories/bloggers-repository';
import { NextFunction, Request, Response } from 'express';

export const bloggerExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isFounded = bloggers.find((user) => user.id === req.body.bloggerId);
  if (!isFounded) {
    res.sendStatus(404);
  } else {
    next();
  }
};
