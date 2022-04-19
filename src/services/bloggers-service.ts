import { bloggersRepository, BloggersType } from '../repositories/bloggers-repository';
import { ObjectId } from 'mongodb';
import { postsRepository, PostType } from '../repositories/posts-repository';

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
  async getPostsById(id: string): Promise<PostType[]> {
    return await bloggersRepository.getPostsById(id);
  },
  async createPost(
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
};
