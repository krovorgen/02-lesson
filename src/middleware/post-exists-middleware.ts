import { NextFunction, Request, Response } from 'express';
import { postsRepository } from '../repositories/posts-repository';

export const postExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let postId: string;
  if (req.params.postId) {
    postId = req.params.postId;
  } else {
    postId = req.body.postId;
  }
  const isFounded = await postsRepository.getById(postId);
  if (!isFounded) {
    res.sendStatus(404);
  } else {
    next();
  }
};
