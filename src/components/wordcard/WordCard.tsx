import { useState } from "react";
import { Card } from "../../types/types";
import "./WordCard.css";

type State = "show" | "hide";

type Props = Card & {
  defaultState: State;
};

function bracketToBoldTag(str: string) {
  return str.replace(/\[\[(.+?)\]\]/g, "<b>$1</b>");
}

function maskWord(word: string) {
  return word.replace(/\S/g, "*");
}

function maskBold(str: string) {
  return str.replace(
    /<b>(.+?)<\/b>/g,
    (substring: string, ...args: any[]): string => {
      return maskWord(args[0]);
    }
  );
}

export default function WordCard({
  defaultState,
  id,
  originalWord,
  sentence,
  articleId,
  wordTileIndex,
  dictResult,
  addTime,
}: Props) {
  const [cardState, setCardState] = useState("hide");
  function toggleHide() {
    setCardState(cardState === "hide" ? "show" : "hide");
  }
  if (cardState === "show") {
    return (
      <div className="word-card" onClick={toggleHide}>
        <h3>{dictResult.headword}</h3>
        <p dangerouslySetInnerHTML={{ __html: dictResult.definition }}></p>
        <p dangerouslySetInnerHTML={{ __html: bracketToBoldTag(sentence) }}></p>
      </div>
    );
  } else {
    return (
      <div className="word-card" onClick={toggleHide}>
        <h3>{maskWord(dictResult.headword)}</h3>
        <p
          dangerouslySetInnerHTML={{ __html: maskBold(dictResult.definition) }}
        ></p>
        <p
          dangerouslySetInnerHTML={{
            __html: maskBold(bracketToBoldTag(sentence)),
          }}
        ></p>
      </div>
    );
  }
}
