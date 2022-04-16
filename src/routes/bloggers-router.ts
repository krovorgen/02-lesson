import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { bloggersRepository } from '../repositories/bloggers-repository';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { bloggerExistsMiddleware } from '../middleware/blogger-exists-middleware';

export const bloggersRouter = Router({});

bloggersRouter
  .get('/', (req: Request, res: Response) => {
    res.send(bloggersRepository.get());
  })
  .get('/:bloggerId', (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    const user = bloggersRepository.getById(id);
    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  })
  .put(
    '/:bloggerId',
    body('name').notEmpty(),
    body('youtubeUrl')
      .notEmpty()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/),
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    (req: Request, res: Response) => {
      const id = req.params.bloggerId;
      bloggersRepository.updateById(id, req.body.name, req.body.youtubeUrl);
      res.sendStatus(204);
    }
  )
  .post(
    '/',
    body('name').notEmpty(),
    body('youtubeUrl')
      .notEmpty()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/),
    inputValidatorMiddleware,
    (req: Request, res: Response) => {
      res.status(201).send(bloggersRepository.create(req.body.name, req.body.youtubeUrl));
    }
  )
  .delete('/:bloggerId', bloggerExistsMiddleware, (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    bloggersRepository.deleteById(id);

    res.sendStatus(204);
  });
