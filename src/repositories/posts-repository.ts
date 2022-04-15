import { v1 } from 'uuid';

type PostsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
};

export let posts: PostsType[] = [];

export const postsRepository = {
  get() {
    return posts;
  },
  getById(id: string) {
    return posts.find((post) => post.id === id);
  },
  deleteById(id: string) {
    const index = posts.findIndex((item) => item.id === id);

    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  updateById(id: string, title: string, shortDescription: string, content: string) {
    const post = posts.find((post) => post.id === id);
    if (post) {
      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.bloggerId = id; // ???
      return true;
    } else {
      return false;
    }
  },
  create(id: string, title: string, shortDescription: string, content: string) {
    const newPost = {
      id: v1(),
      title,
      shortDescription,
      content,
      bloggerId: id,
    };
    posts.push(newPost);
    return newPost;
  },
};
