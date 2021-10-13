interface ArticleBlock {
  type: "text" | "subtitle" | "citation" | "image";
  /**
   * use markdown notation
   * *italic* **bold**
   */
  content: string;
}

export interface Article {
  articleId: string;
  title: string;
  /**
   * epoch time in mills
   */
  publishDate: number;
  content: ArticleBlock[];
}

export interface ArticleItem {
  title: string;
  date: string;
  img: string;
  description: string;
  id: string;
}

export interface User {
  _id: string;
  name: string;
  creationDate: number;
  enabled: boolean;
}

export interface ArticleItemNew {
  _id: string;
  title: string;
  url?: string;
  hostname?: string;
  byline: string;
  dir: any;
  length: number;
  excerpt: string;
  siteName: string | null;
  creationDate: number;
  description: string | null;
  user: User;
  favorate: boolean;
}

export interface BookItem {
  id: string;
  coverUrl: string;
  title: string;
}

export enum TOKEN_TYPE {
  WORD,
  BLANK,
  SYMBOL,
  EOL,
}

export interface Token {
  word: string;
  type: TOKEN_TYPE;
}

export interface DictResultEntry {
  headword: string;
  phonetics?: string;
  shortDefinition: string;
  definition: string;
}

export interface Card {
  _id?: string;
  checked: boolean;
  userId: string;
  originalWord: string;
  sentence: string;
  articleId: string;
  wordTileIndex: number;
  dictResult: DictResultEntry;
  // unix time
  addTime: number;
  exported?: boolean;
}
