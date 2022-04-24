import { NextFunction, Request, Response } from 'express';
import { usersService } from '../services/users-service';

export const userExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let userId: string;
  if (req.params.userId) {
    userId = req.params.userId;
  } else {
    userId = req.body.userId;
  }

  const isFounded = await usersService.getById(userId);
  if (!isFounded) {
    res.sendStatus(404);
  } else {
    next();
  }
};
