import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { ArgPaginationType, constructorPagination } from '../helpers/constructor-pagination';
import { usersService } from '../services/users-service';
import { userExistsMiddleware } from '../middleware/user-exists-middleware';

export const usersRouter = Router({});

usersRouter
  .get('/', async (req: Request, res: Response) => {
    const paginationData = constructorPagination(req.query as ArgPaginationType);

    res.send(await usersService.get(paginationData));
  })
  .get('/:userId', userExistsMiddleware, async (req: Request, res: Response) => {
    res.send(await usersService.getById(req.params.userId));
  })
  .post(
    '/',
    body('username').notEmpty(),
    body('password').notEmpty(),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      const newUser = await usersService.createAndLogin(req.body.username, req.body.password);
      res.status(201).send(newUser);
    }
  )
  .delete('/:userId', userExistsMiddleware, async (req: Request, res: Response) => {
    await usersService.deleteById(req.params.userId);
    res.sendStatus(204);
  });
