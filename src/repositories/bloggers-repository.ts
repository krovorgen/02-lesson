import { client } from './db';
import { posts, PostType } from './posts-repository';

export type BloggersType = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export let bloggers = client.db('test').collection<BloggersType>('bloggers');

export const bloggersRepository = {
  async get(): Promise<BloggersType[]> {
    return await bloggers.find({}, { projection: { _id: 0 } }).toArray();
  },
  async getById(id: string): Promise<BloggersType | null> {
    return await bloggers.findOne({ id: +id }, { projection: { _id: 0 } });
  },
  async updateById(id: string, name: string, youtubeUrl: string): Promise<void> {
    await bloggers.updateOne({ id: +id }, { $set: { name, youtubeUrl } });
  },
  async create(newBlogger: BloggersType): Promise<void> {
    await bloggers.insertOne(newBlogger);
  },
  async deleteById(id: string): Promise<void> {
    await bloggers.deleteOne({ id: +id });
  },
  async getPostsById(id: string): Promise<PostType[]> {
    return await posts.find({ bloggerId: +id }).toArray();
  },
};
