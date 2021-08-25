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

export interface ArticleItemNew {
  title: string;
  byline: string;
  dir: string;
  length: number;
  excerpt: string;
  siteName: string;
  articleJson: string;
  image?: string;
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
  id: string;
  originalWord: string;
  sentence: string;
  articleId: string;
  wordTileIndex: number;
  dictResult: DictResultEntry;
  // unix time
  addTime: number;
  exported?: boolean;
}
