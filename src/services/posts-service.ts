import { ObjectId } from 'mongodb';
import { postsRepository, PostType } from '../repositories/posts-repository';
import { bloggersRepository } from '../repositories/bloggers-repository';
import { PaginationBodyResponse } from '../types/paginationBodyResponse';
import { ConstructorPaginationType } from '../helpers/constructor-pagination';

export const postsService = {
  async get(paginationData: ConstructorPaginationType): Promise<PaginationBodyResponse<PostType[]>> {
    return await postsRepository.get(paginationData);
  },
  async getById(id: string): Promise<PostType | null> {
    return await postsRepository.getById(id);
  },
  async updateById(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<boolean> {
    const isFounded = await bloggersRepository.getById(bloggerId);
    if (!isFounded) return false;

    return await postsRepository.updateById(id, title, shortDescription, content, bloggerId);
  },
  async create(
    bloggerId: string,
    title: string,
    shortDescription: string,
    content: string
  ): Promise<PostType | boolean> {
    const blogger = await bloggersRepository.getById(bloggerId);
    if (!blogger) return false;

    const newPost: PostType & { _id?: ObjectId } = {
      id: +new Date(),
      title,
      shortDescription,
      content,
      bloggerId: +bloggerId,
      bloggerName: blogger.name,
    };
    await postsRepository.create(newPost);
    delete newPost['_id'];
    return newPost;
  },
  async deleteById(id: string): Promise<void> {
    await postsRepository.deleteById(id);
  },
};
