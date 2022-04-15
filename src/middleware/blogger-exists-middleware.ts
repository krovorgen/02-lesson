import { check } from 'express-validator';
import { bloggers } from '../repositories/bloggers-repository';
import { NextFunction, Request, Response } from 'express';

export const bloggerExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  check('bloggerId').custom((value) => {
    const isFounded = bloggers.find((user) => user.id === value);
    if (!isFounded) {
      res.sendStatus(404);
    } else {
      next();
    }
  });
};
