import { body } from 'express-validator';

export const checkYouTubeUrl = body('youtubeUrl')
  .notEmpty()
  .matches(/^(ftp|http|https):\/\/[^ "]+$/);
