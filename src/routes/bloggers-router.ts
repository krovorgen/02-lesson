import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { bloggersRepository } from '../repositories/bloggers-repository';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { bloggerExistsMiddleware } from '../middleware/blogger-exists-middleware';
import { checkYouTubeUrl } from './check-youtube-url-middleware';

export const bloggersRouter = Router({});

bloggersRouter
  .get('/', (req: Request, res: Response) => {
    res.send(bloggersRepository.get());
  })
  .get('/:bloggerId', bloggerExistsMiddleware, (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    const user = bloggersRepository.getById(id);
    res.send(user);
  })
  .put(
    '/:bloggerId',
    body('name').notEmpty(),
    checkYouTubeUrl,
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    (req: Request, res: Response) => {
      const id = req.params.bloggerId;
      bloggersRepository.updateById(id, req.body.name, req.body.youtubeUrl);
      res.sendStatus(204);
    }
  )
  .post('/', body('name').notEmpty(), checkYouTubeUrl, inputValidatorMiddleware, (req: Request, res: Response) => {
    res.status(201).send(bloggersRepository.create(req.body.name, req.body.youtubeUrl));
  })
  .delete('/:bloggerId', bloggerExistsMiddleware, (req: Request, res: Response) => {
    const id = req.params.bloggerId;
    bloggersRepository.deleteById(id);

    res.sendStatus(204);
  });
