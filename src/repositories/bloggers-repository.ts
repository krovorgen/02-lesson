type BloggersType = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export let bloggers: BloggersType[] = [
  {
    id: 0,
    name: 'Olga',
    youtubeUrl: 'https://www.youtube.com/channel/UC1_6nRWugDv_B6icoZtHDDw',
  },
];

export const bloggersRepository = {
  get() {
    return bloggers;
  },
  getById(id: string) {
    return bloggers.find((user) => user.id === +id);
  },
  updateById(id: string, name: string, youtubeUrl: string) {
    const user = bloggers.find((user) => user.id === +id)!;
    user.name = name;
    user.youtubeUrl = youtubeUrl;
  },
  create(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: +new Date(),
      name,
      youtubeUrl,
    };
    bloggers.push(newBlogger);
    return newBlogger;
  },
  deleteById(id: string) {
    const index = bloggers.findIndex((item) => item.id === +id);

    if (index !== -1) {
      bloggers.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
};
