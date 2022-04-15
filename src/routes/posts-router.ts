import { NextFunction, Request, Response, Router } from 'express';
import { postsRepository } from '../repositories/posts-repository';
import { inputValidatorMiddleware } from '../middleware/input-validator-middleware';
import { body, param } from 'express-validator';
import { bloggerExistsMiddleware } from '../middleware/blogger-exists-middleware';
import { bloggers } from '../repositories/bloggers-repository';

export const postsRouter = Router({});

postsRouter
  .get('/', (req: Request, res: Response) => {
    res.send(postsRepository.get());
  })
  .get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const post = postsRepository.getById(id);

    if (post) {
      res.send(post);
    } else {
      res.sendStatus(404);
    }
  })
  .put(
    '/:bloggerId',
    body('title').notEmpty(),
    body('shortDescription').notEmpty(),
    body('content').notEmpty(),
    param('bloggerId').notEmpty(),
    inputValidatorMiddleware,
    bloggerExistsMiddleware,
    (req: Request, res: Response) => {
      const id = req.params.bloggerId;
      const isUpdated = postsRepository.updateById(id, req.body.title, req.body.shortDescription, req.body.content);
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
    (req: Request, res: Response, next: NextFunction) => {
      let bloggerId: string;
      if (req.params.bloggerId) {
        bloggerId = req.params.bloggerId;
      } else {
        bloggerId = req.body.bloggerId;
      }
      const isFounded = bloggers.find((user) => user.id === +bloggerId);
      if (!isFounded) {
        res.sendStatus(400).send('This blogger not found');
      } else {
        next();
      }
    },
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
  .delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const isDeleted = postsRepository.deleteById(id);
    res.sendStatus(isDeleted ? 204 : 404);
  });
