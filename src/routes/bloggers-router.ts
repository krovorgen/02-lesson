import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { bloggersRepository } from '../repositories/bloggers-repository';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { bloggerExistsMiddleware } from '../middleware/blogger-exists-middleware';
import { checkYouTubeUrl } from './check-youtube-url-middleware';

export const bloggersRouter = Router({});

bloggersRouter
  .get('/', async (req: Request, res: Response) => {
    res.send(await bloggersRepository.get());
  })
  .get('/:bloggerId', bloggerExistsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    res.send(await bloggersRepository.getById(id));
  })
  .put(
    '/:bloggerId',
    body('name').notEmpty(),
    checkYouTubeUrl,
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    async (req: Request, res: Response) => {
      const id = req.params.bloggerId;
      await bloggersRepository.updateById(id, req.body.name, req.body.youtubeUrl);
      res.sendStatus(204);
    }
  )
  .post(
    '/',
    body('name').notEmpty(),
    checkYouTubeUrl,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      const newPost = await bloggersRepository.create(req.body.name, req.body.youtubeUrl);
      res.status(201).send(newPost);
    }
  )
  .delete('/:bloggerId', bloggerExistsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    await bloggersRepository.deleteById(id);
    res.sendStatus(204);
  });
