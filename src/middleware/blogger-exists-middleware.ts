import { bloggersRepository } from '../repositories/bloggers-repository';
import { NextFunction, Request, Response } from 'express';

export const bloggerExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let bloggerId: string;
  if (req.params.bloggerId) {
    bloggerId = req.params.bloggerId;
  } else {
    bloggerId = req.body.bloggerId;
  }

  const isFounded = await bloggersRepository.getById(bloggerId);
  if (!isFounded) {
    res.sendStatus(404);
  } else {
    next();
  }
};
