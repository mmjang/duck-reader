import { useState } from "react";
import { Article, TOKEN_TYPE } from "../../types/types";
import { splitWords } from "../../utils";
import WordTile from "../wordtile/WordTile";
import { Token } from "../../types/types";
import { collins } from "../../api/collins";
import Dictionary from "../dictionary/Dictionary";
import "./Reader.css";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Reader({
  title = "",
  content = [],
  articleId,
}: Partial<Article> & { articleId: string }) {
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

  async function onWordClick(id: number) {
    console.log("word select: ", id);
    const token = tokens[id];
    if (token.type === TOKEN_TYPE.WORD) {
      setSelectedWordIndex(id);
    }
  }

  function makeWordTiles(str: string) {
    return splitWords(str)
      .concat({ type: TOKEN_TYPE.EOL, word: "" })
      .map((word, i) => {
        const currentIndex = tokenIndex++;
        tokens.push(word);
        return (
          <WordTile
            id={currentIndex}
            text={word.word}
            selected={selectedWordIndex === currentIndex}
            onClick={onWordClick}
            key={currentIndex}
          ></WordTile>
        );
      });
  }

  function isSentenceEnd(token: Token) {
    const str = token.word;
    return (
      token.type === TOKEN_TYPE.EOL ||
      str.endsWith("?") ||
      str.endsWith(".") ||
      str.endsWith("!") ||
      str.endsWith("...") ||
      str.endsWith('?"') ||
      str.endsWith('!"') ||
      str.endsWith('."')
    );
  }

  function getSentenceFromIndex(index: number) {
    const thrashhold = 50;
    let left = index - 1;
    let right = index;
    let sentence = `[[${tokens[index].word}]]`;
    while (left >= 0 && index - left < thrashhold) {
      if (isSentenceEnd(tokens[left])) {
        break;
      }
      sentence = tokens[left].word + sentence;
      left--;
    }
    while (right < tokens.length && right - index < thrashhold) {
      if (isSentenceEnd(tokens[right])) {
        break;
      }
      right++;
      sentence = sentence + tokens[right].word;
    }
    return sentence;
  }

  function onClickReader() {
    setSelectedWordIndex(-1);
  }

  let tokenIndex = 0;
  const tokens = [] as Token[];
  return (
    <>
      <div className="reader" onClick={onClickReader}>
        <h3>{makeWordTiles(title)}</h3>
        {content?.map((item, index) => (
          <p key={index}>{makeWordTiles(item.content)}</p>
        ))}
      </div>
      {selectedWordIndex >= 0 ? (
        <Dictionary
          word={tokens[selectedWordIndex].word}
          sentence={getSentenceFromIndex(selectedWordIndex)}
          articleId={articleId}
          wordIndex={selectedWordIndex}
          onClose={() => setSelectedWordIndex(-1)}
        ></Dictionary>
      ) : null}
    </>
  );
}
