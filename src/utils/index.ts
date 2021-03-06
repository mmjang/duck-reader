import { Token, TOKEN_TYPE } from "../types/types";

export function makeClasses(classObject: { [key: string]: boolean }): string {
  return Object.entries(classObject)
    .filter(([k, v]) => v)
    .map(([k, v]) => k)
    .join(" ");
}

export function splitWords(text: string): Token[] {
  const WORD_REG = /^[A-Za-z-]+/;
  const SYMBOL_REG = /^([^A-Za-z- ])+/;
  const BLANK_REG = /^\s+/;
  const result = [] as Token[];
  let count = 0;
  while (text) {
    let c;
    if ((c = text.match(WORD_REG))) {
      result.push({
        word: c[0],
        type: TOKEN_TYPE.WORD,
      });
      count++;
    } else if ((c = text.match(BLANK_REG))) {
      result.push({
        word: c[0],
        type: TOKEN_TYPE.BLANK,
      });
      count++;
    } else if ((c = text.match(SYMBOL_REG))) {
      result.push({
        word: c[0],
        type: TOKEN_TYPE.SYMBOL,
      });
      count++;
    }
    if (c) {
      text = text.slice(c[0].length);
    }
  }
  return result;
}
