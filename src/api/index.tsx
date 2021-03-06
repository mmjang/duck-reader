import { Article } from "../types/types";

export const api = {
  async getArticleDetail(id: string): Promise<Article> {
    const article = (await fetch(`/data/article/${id}.json`).then((r) =>
      r.json()
    )) as Article;
    return article;
  },
};
