import { check } from 'express-validator';
import { bloggers } from '../repositories/bloggers-repository';

export const bloggerExistsMiddleware = check('bloggerId').custom((value) => {
  const isFounded = bloggers.find((user) => user.id === value);
  if (!isFounded) {
    throw new Error('The blogger was not found');
  } else {
    return true;
  }
});
