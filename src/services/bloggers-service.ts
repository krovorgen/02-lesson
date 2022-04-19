import { bloggersRepository } from '../repositories/bloggers-repository';
import { ObjectId } from 'mongodb';

export type BloggersType = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export const bloggersService = {
  async get(): Promise<BloggersType[]> {
    return await bloggersRepository.get();
  },
  async getById(id: string): Promise<BloggersType | null> {
    return await bloggersRepository.getById(id);
  },
  async updateById(id: string, name: string, youtubeUrl: string): Promise<void> {
    await bloggersRepository.updateById(id, name, youtubeUrl);
  },
  async create(name: string, youtubeUrl: string): Promise<BloggersType> {
    const newBlogger: BloggersType & { _id?: ObjectId } = {
      id: +new Date(),
      name,
      youtubeUrl,
    };
    await bloggersRepository.create(newBlogger);
    delete newBlogger['_id'];
    return newBlogger;
  },
  async deleteById(id: string): Promise<void> {
    await bloggersRepository.deleteById(id);
  },
};
