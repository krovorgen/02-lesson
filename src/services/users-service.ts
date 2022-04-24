import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { PaginationBodyResponse } from '../types/paginationBodyResponse';
import { ConstructorPaginationType } from '../helpers/constructor-pagination';
import { usersRepository, UserType } from '../repositories/users-repository';

export const usersService = {
  async get(paginationData: ConstructorPaginationType): Promise<PaginationBodyResponse<UserType[]>> {
    return await usersRepository.get(paginationData);
  },
  async getById(id: string): Promise<UserType | null> {
    return await usersRepository.getById(id);
  },
  async createAndLogin(login: string, password: string): Promise<UserType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserType & { _id?: ObjectId } = {
      id: +new Date(),
      login,
      password: passwordHash,
      salt: passwordSalt,
    };
    await usersRepository.createAndLogin(newUser);
    return {
      id: newUser.id,
      login: newUser.login,
    };
  },
  async deleteById(id: string): Promise<void> {
    await usersRepository.deleteById(id);
  },
  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  },
};
