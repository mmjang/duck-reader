import { useState } from "react";
import { Card } from "../../types/types";
import { makeClasses } from "../../utils";
import { bracketToBoldTag, maskWord, maskBold } from "../../utils/tags";
import "./WordCard.css";
import link from "./link.svg";

type State = "show" | "hide";

type Props = Card & {
  defaultState: State;
  onShowContextPopup: (articleId: string, wordTileIndex: number) => void;
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
  exported,
  onShowContextPopup,
}: Props) {
  const [cardState, setCardState] = useState("hide");
  function toggleHide() {
    setCardState(cardState === "hide" ? "show" : "hide");
  }
  const cardClass = makeClasses({
    "word-card": true,
    exported: Boolean(exported),
  });
  if (cardState === "show") {
    return (
      <div className={cardClass} onClick={toggleHide}>
        <h3>
          <img
            src={link}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onShowContextPopup(articleId, wordTileIndex);
            }}
          />{" "}
          {dictResult.headword}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: dictResult.definition }}></p>
        <p dangerouslySetInnerHTML={{ __html: bracketToBoldTag(sentence) }}></p>
      </div>
    );
  } else {
    return (
      <div className={cardClass} onClick={toggleHide}>
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
