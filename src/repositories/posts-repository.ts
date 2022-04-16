import { bloggers } from './bloggers-repository';

type PostsType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
};

export let posts: PostsType[] = [
  {
    id: 0,
    title: 'Обед',
    shortDescription: 'Кушала',
    content: 'было вкусно',
    bloggerId: 0,
    bloggerName: 'Olga',
  },
];
export const postsRepository = {
  get() {
    return posts;
  },
  getById(id: string) {
    return posts.find((post) => post.id === +id);
  },
  deleteById(id: string) {
    const index = posts.findIndex((item) => item.id === +id);

    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  updateById(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
    const post = posts.find((post) => post.id === +id);
    if (post) {
      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.bloggerId = +bloggerId; // ???
      return true;
    } else {
      return false;
    }
  },
  create(id: string, title: string, shortDescription: string, content: string) {
    const isFounded = bloggers.find((user) => user.id === +id);
    if (!isFounded) return false;
    const newPost: PostsType = {
      id: +new Date(),
      title,
      shortDescription,
      content,
      bloggerId: +id,
      bloggerName: bloggers.find((item) => item.id === +id)!.name,
    };
    posts.push(newPost);
    return newPost;
  },
};
