import { Request, Response, Router } from 'express';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { body, param } from 'express-validator';
import { postExistsMiddleware } from '../middleware/post-exists-middleware';
import { postsService } from '../services/posts-service';

export const postsRouter = Router({});

postsRouter
  .get('/', async (req: Request, res: Response) => {
    res.send(await postsService.get());
  })
  .get('/:postId', postExistsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.postId;
    res.send(await postsService.getById(id));
  })
  .put(
    '/:postId',
    body('title').notEmpty(),
    body('shortDescription').notEmpty(),
    body('content').notEmpty(),
    body('bloggerId').notEmpty().isNumeric(),
    param('postId').isNumeric(),
    inputValidatorMiddleware,
    postExistsMiddleware,
    async (req: Request, res: Response) => {
      const id = req.params.postId;
      const isUpdated = await postsService.updateById(
        id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.bloggerId
      );
      res.sendStatus(isUpdated ? 204 : 400);
    }
  )
  .post(
    '/',
    body('title').notEmpty(),
    body('shortDescription').notEmpty(),
    body('content').notEmpty(),
    body('bloggerId').notEmpty().isNumeric(),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
      const createdPost = await postsService.create(
        req.body.bloggerId,
        req.body.title,
        req.body.shortDescription,
        req.body.content
      );
      if (createdPost) {
        res.status(201).send(createdPost);
      } else {
        res.sendStatus(400);
      }
    }
  )
  .delete('/:postId', postExistsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.postId;
    await postsService.deleteById(id);
    res.sendStatus(204);
  });
