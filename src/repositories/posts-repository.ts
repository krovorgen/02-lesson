import { client } from './db';
import { PaginationBodyResponse } from '../types/paginationBodyResponse';
import { ConstructorPaginationType } from '../helpers/constructor-pagination';

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
  async getCountPosts(): Promise<number> {
    return await posts.countDocuments();
  },
  async get(paginationData: ConstructorPaginationType): Promise<PaginationBodyResponse<PostType[]>> {
    const resultDB = await posts
      .find({}, { projection: { _id: 0 } })
      .skip(paginationData.pageNumber > 0 ? (paginationData.pageNumber - 1) * paginationData.pageSize : 0)
      .limit(paginationData.pageSize)
      .toArray();

    const totalCount = await postsRepository.getCountPosts();

    return {
      pagesCount: Math.ceil(totalCount / paginationData.pageSize),
      page: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      totalCount,
      items: resultDB,
    };
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
