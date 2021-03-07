import { useState } from "react";
import { Card } from "../../types/types";
import { bracketToBoldTag, maskWord, maskBold } from "../../utils/tags";
import "./WordCard.css";

type State = "show" | "hide";

type Props = Card & {
  defaultState: State;
};

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
