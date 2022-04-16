import { Request, Response, Router } from 'express';
import { postsRepository } from '../repositories/posts-repository';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { body, param } from 'express-validator';
import { postExistsMiddleware } from '../middleware/post-exists-middleware';

export const postsRouter = Router({});

postsRouter
  .get('/', (req: Request, res: Response) => {
    res.send(postsRepository.get());
  })
  .get('/:postId', postExistsMiddleware, (req: Request, res: Response) => {
    const id = req.params.postId;
    const post = postsRepository.getById(id);
    res.send(post);
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
    (req: Request, res: Response) => {
      const id = req.params.postId;
      const isUpdated = postsRepository.updateById(
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
    (req: Request, res: Response) => {
      const createdPost = postsRepository.create(
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
  .delete('/:postId', postExistsMiddleware, (req: Request, res: Response) => {
    const id = req.params.postId;
    postsRepository.deleteById(id);
    res.sendStatus(204);
  });
