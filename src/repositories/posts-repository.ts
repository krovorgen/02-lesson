import { client } from './db';

export type PostType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
};

export let posts = client.db('test').collection<PostType>('posts');

export const postsRepository = {
  async get(): Promise<PostType[]> {
    return await posts.find({}, { projection: { _id: 0 } }).toArray();
  },
  async getById(id: string): Promise<PostType | null> {
    return await posts.findOne({ id: +id }, { projection: { _id: 0 } });
  },
  async updateById(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<boolean> {
    const isUpdated = await posts.updateOne(
      { id: +id },
      { $set: { title, shortDescription, content, bloggerId: +bloggerId } }
    );
    return isUpdated.matchedCount === 1;
  },
  async create(newPost: PostType): Promise<void> {
    await posts.insertOne(newPost);
  },
  async deleteById(id: string): Promise<void> {
    await posts.deleteOne({ id: +id });
  },
};
