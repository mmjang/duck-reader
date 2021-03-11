import { useEffect, useRef, useState } from "react";
import { Article, TOKEN_TYPE } from "../../types/types";
import { splitWords } from "../../utils";
import WordTile from "../wordtile/WordTile";
import { Token } from "../../types/types";
import { collins } from "../../api/collins";
import Dictionary from "../dictionary/Dictionary";
import "./Reader.css";
import { useLocation } from "react-router-dom";

export default function Reader({
  title = "",
  content = [],
  articleId,
  // tile index list of highlighted words
  highlights = [],
  // is word selectable
  selectable = true,
  scrollToHighlights = false,
}: Partial<Article> & {
  articleId: string;
  highlights?: number[];
  selectable?: boolean;
  scrollToHighlights?: boolean;
}) {
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

  async function onWordClick(id: number) {
    console.log("word select: ", id);
    const token = tokens[id];
    if (token.type === TOKEN_TYPE.WORD && selectable) {
      setSelectedWordIndex(id);
    }
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

  useEffect(() => {
    if (highlights.length > 0) {
      const firstHighlight = highlights[0];
      if (firstHighlight < tileRefArray.current.length) {
        tileRefArray.current[firstHighlight].scrollIntoView();
      }
    }
  }, [highlights]);

  let tokenIndex = 0;
  const tokens = [] as Token[];
  const tileRefArray = useRef<Element[]>([]);
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
            highlighted={highlights.includes(currentIndex)}
            key={currentIndex}
            tileRefFunc={(el: HTMLSpanElement) => {
              tileRefArray.current[currentIndex] = el;
            }}
          ></WordTile>
        );
      });
  }
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
