import { NextFunction, Request, Response } from 'express';
import { postsService } from '../services/posts-service';

export const postExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let postId: string;
  if (req.params.postId) {
    postId = req.params.postId;
  } else {
    postId = req.body.postId;
  }
  const isFounded = await postsService.getById(postId);
  if (!isFounded) {
    res.sendStatus(404);
  } else {
    next();
  }
};
