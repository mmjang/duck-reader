import { useState } from "react";
import { Card } from "../../types/types";
import { makeClasses } from "../../utils";
import { bracketToBoldTag, maskWord, maskBold } from "../../utils/tags";
import { Button } from "@material-ui/core";
import { useConfirm } from "material-ui-confirm";
import "./WordCard.css";
import link from "./link.svg";
import axios from "axios";

type State = "show" | "hide";

type Props = Card & {
  defaultState: State;
  onShowContextPopup: (articleId: string, wordTileIndex: number) => void;
  onDelete: () => void;
};

export default function WordCard({
  userId,
  _id,
  defaultState,
  originalWord,
  sentence,
  articleId,
  wordTileIndex,
  dictResult,
  addTime,
  exported,
  onShowContextPopup,
  onDelete,
}: Props) {
  const [cardState, setCardState] = useState("hide");
  const confirm = useConfirm();
  function toggleHide() {
    setCardState(cardState === "hide" ? "show" : "hide");
  }
  const cardClass = makeClasses({
    "word-card": true,
    exported: Boolean(exported),
  });

  const deleteButton =
    localStorage.getItem("userId") === userId ? (
      <Button
        variant="text"
        color="secondary"
        onClick={(e) => {
          e.stopPropagation();
          confirm({
            title: "确定要删除吗？",
          }).then(() => {
            axios
              .post("/api/deleteCard", {
                cardId: _id,
              })
              .then((data) => {
                if (data.data.success) {
                  onDelete();
                }
              });
          });
        }}
      >
        删除
      </Button>
    ) : null;

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
          {deleteButton}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: dictResult.definition }}></p>
        <p dangerouslySetInnerHTML={{ __html: bracketToBoldTag(sentence) }}></p>
      </div>
    );
  } else {
    return (
      <div className={cardClass} onClick={toggleHide}>
        <h3>
          {maskWord(dictResult.headword)} {deleteButton}
        </h3>
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
