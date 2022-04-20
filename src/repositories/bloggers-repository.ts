import { client } from './db';
import { posts, postsRepository, PostType } from './posts-repository';
import { PaginationBodyResponse } from '../types/paginationBodyResponse';
import { ConstructorPaginationType } from '../helpers/constructor-pagination';

export type BloggersType = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export let bloggers = client.db('test').collection<BloggersType>('bloggers');

export const bloggersRepository = {
  async getCountBloggers(): Promise<number> {
    return await bloggers.countDocuments();
  },
  async get(paginationData: ConstructorPaginationType): Promise<PaginationBodyResponse<BloggersType[]>> {
    const resultDB = await bloggers
      .find({}, { projection: { _id: 0 } })
      .skip(paginationData.pageNumber > 0 ? (paginationData.pageNumber - 1) * paginationData.pageSize : 0)
      .limit(paginationData.pageSize)
      .toArray();

    const totalCount = await this.getCountBloggers();

    return {
      pagesCount: Math.ceil(totalCount / paginationData.pageSize),
      page: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      totalCount,
      items: resultDB,
    };
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
  async getPostsById(
    id: string,
    paginationData: ConstructorPaginationType
  ): Promise<PaginationBodyResponse<PostType[]>> {
    const resultDB = await posts
      .find({ bloggerId: +id }, { projection: { _id: 0 } })
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
};
