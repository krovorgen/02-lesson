import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { bloggerExistsMiddleware } from '../middleware/blogger-exists-middleware';
import { checkYouTubeUrl } from '../middleware/check-youtube-url-middleware';
import { bloggersService } from '../services/bloggers-service';

export const bloggersRouter = Router({});

bloggersRouter
  .get('/', async (req: Request, res: Response) => {
    res.send(await bloggersService.get());
  })
  .get('/:bloggerId', bloggerExistsMiddleware, async (req: Request, res: Response) => {
    res.send(await bloggersService.getById(req.params.bloggerId));
  })
  .put(
    '/:bloggerId',
    body('name').notEmpty(),
    checkYouTubeUrl,
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    async (req: Request, res: Response) => {
      await bloggersService.updateById(req.params.bloggerId, req.body.name, req.body.youtubeUrl);
      res.sendStatus(204);
    }
  )
  .post(
    '/',
    body('name').notEmpty(),
    checkYouTubeUrl,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      const newPost = await bloggersService.create(req.body.name, req.body.youtubeUrl);
      res.status(201).send(newPost);
    }
  )
  .delete('/:bloggerId', bloggerExistsMiddleware, async (req: Request, res: Response) => {
    await bloggersService.deleteById(req.params.bloggerId);
    res.sendStatus(204);
  })
  .get('/:bloggerId/posts', bloggerExistsMiddleware, async (req: Request, res: Response) => {
    res.send(await bloggersService.getPostsById(req.params.bloggerId));
  })
  .post(
    '/:bloggerId/posts',
    body('title').notEmpty(),
    body('shortDescription').notEmpty(),
    body('content').notEmpty(),
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    async (req: Request, res: Response) => {
      res.send(
        await bloggersService.createPost(
          req.params.bloggerId,
          req.body.title,
          req.body.shortDescription,
          req.body.content
        )
      );
    }
  );
