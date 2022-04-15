import { v1 } from 'uuid';

type BloggersType = {
  id: string;
  name: string;
  youtubeUrl: string;
};

export let bloggers: BloggersType[] = [];

export const bloggersRepository = {
  get() {
    return bloggers;
  },
  getById(id: string) {
    return bloggers.find((user) => user.id === id);
  },
  deleteById(id: string) {
    const index = bloggers.findIndex((item) => item.id === id);

    if (index !== -1) {
      bloggers.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  updateById(id: string, name: string, youtubeUrl: string) {
    const user = bloggers.find((user) => user.id === id);
    if (user) {
      user.name = name;
      user.youtubeUrl = youtubeUrl;
      return true;
    } else {
      return false;
    }
  },
  create(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: v1(),
      name,
      youtubeUrl,
    };
    bloggers.push(newBlogger);
    return newBlogger;
  },
};
