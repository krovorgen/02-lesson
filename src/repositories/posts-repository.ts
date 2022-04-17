import { bloggersRepository } from './bloggers-repository';
import { client } from './db';
import { ObjectId } from 'mongodb';

type PostType = {
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
    const isFounded = await bloggersRepository.getById(bloggerId);
    if (!isFounded) return false;

    const isUpdated = await posts.updateOne(
      { id: +id },
      { $set: { title, shortDescription, content, bloggerId: +bloggerId } }
    );
    return isUpdated.matchedCount === 1;
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
    await posts.insertOne(newPost);
    delete newPost['_id'];
    return newPost;
  },
  async deleteById(id: string): Promise<void> {
    await posts.deleteOne({ id: +id });
  },
};
