import { useState } from "react";
import { Card } from "../../types/types";
import { makeClasses } from "../../utils";
import { bracketToBoldTag, maskWord, maskBold } from "../../utils/tags";
import { Button, Checkbox, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff, Delete, Link } from "@material-ui/icons";
import { useConfirm } from "material-ui-confirm";
import "./WordCard.css";
import link from "./link.svg";
import axios from "axios";

type State = "show" | "hide";

type Props = Card & {
  defaultState: State;
  onShowContextPopup: (articleId: string, wordTileIndex: number) => void;
  onDelete: () => void;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
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
  checked,
  onCheckChange,
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
      <IconButton
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
        <Delete></Delete>
      </IconButton>
    ) : null;

  const checkbox = (
    <Checkbox
      checked={checked}
      onChange={(e) => {
        e.stopPropagation();
        onCheckChange(e.target.checked);
      }}
    ></Checkbox>
  );

  const toolRow = (
    <div>
      {checkbox}
      <IconButton
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onShowContextPopup(articleId, wordTileIndex);
        }}
      >
        <Link />
      </IconButton>
      {cardState === "hide" ? (
        <IconButton onClick={toggleHide}>
          <VisibilityOff></VisibilityOff>
        </IconButton>
      ) : (
        <IconButton onClick={toggleHide}>
          <Visibility></Visibility>
        </IconButton>
      )}
      {deleteButton}
    </div>
  );

  return (
    <div className={cardClass}>
      {toolRow}
      <h3>{dictResult.headword}</h3>
      <p
        dangerouslySetInnerHTML={{ __html: dictResult.definition }}
        className={cardState !== "show" ? "blurred" : ""}
      ></p>
      <p dangerouslySetInnerHTML={{ __html: bracketToBoldTag(sentence) }}></p>
    </div>
  );
}
