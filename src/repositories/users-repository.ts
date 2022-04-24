import { client } from './db';
import { PaginationBodyResponse } from '../types/paginationBodyResponse';
import { ConstructorPaginationType } from '../helpers/constructor-pagination';

export type UserType = {
  id: number;
  login: string;
  password?: string;
  salt?: string;
};

export let users = client.db('test').collection<UserType>('users');

export const usersRepository = {
  async getCountUsers(): Promise<number> {
    return await users.countDocuments();
  },
  async get(paginationData: ConstructorPaginationType): Promise<PaginationBodyResponse<UserType[]>> {
    const resultDB = await users
      .find({}, { projection: { _id: 0, password: 0, salt: 0 } })
      .skip(paginationData.pageNumber > 0 ? (paginationData.pageNumber - 1) * paginationData.pageSize : 0)
      .limit(paginationData.pageSize)
      .toArray();

    const totalCount = await this.getCountUsers();

    return {
      pagesCount: Math.ceil(totalCount / paginationData.pageSize),
      page: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      totalCount,
      items: resultDB,
    };
  },
  async getById(id: string): Promise<UserType | null> {
    return await users.findOne({ id: +id }, { projection: { _id: 0 } });
  },
  async getByLogin(login: string): Promise<UserType | null> {
    return await users.findOne({ login }, { projection: { _id: 0 } });
  },
  async createAndLogin(newUser: UserType): Promise<void> {
    await users.insertOne(newUser);
  },
  async deleteById(id: string): Promise<void> {
    await users.deleteOne({ id: +id });
  },
};
