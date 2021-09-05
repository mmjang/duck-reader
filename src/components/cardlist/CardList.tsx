import { card } from "../../api/card";
import WordCard from "../wordcard/WordCard";
// @ts-ignore
import "./CardList.css";
import { Plugins, Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLocalStorage } from "../../utils/hooks";
import { Card } from "../../types/types";
import ReaderPopup from "../readerpopup/ReaderPopup";
import { detect } from "detect-browser";
import axios from "axios";
import back from "../../asset/back.svg";
import { useHistory } from "react-router-dom";

const { Filesystem, Share } = Plugins;
type CardFilterOption = "all" | "exported" | "unexported";

export default function CardList() {
  const history = useHistory();
  const browser = detect();
  async function exportCard() {
    try {
      const exportedCards = filterCardListByType(cardList, cardFilter);
      const newCardList = cardList.map((c) => {
        if (exportedCards.includes(c)) {
          c.exported = true;
        }
        return c;
      });
      card.setCardList(newCardList);
      setCardList(newCardList);
      if (Capacitor.getPlatform() === "web") {
        toast("牌组已下载");
      } else if (Capacitor.getPlatform() === "android") {
        toast("牌组已导出至sdcard/Documents下");
      }
    } catch (e) {
      toast("导出失败: " + e.message);
    }
  }
  function onCardFilterSelectorChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setCardFilter(event.target.value as CardFilterOption);
  }
  function filterCardListByType(cardList: Card[], type: CardFilterOption) {
    if (type === "all") {
      return cardList;
    } else if (type === "exported") {
      return cardList.filter((card) => card.exported);
    } else {
      return cardList.filter((card) => !card.exported);
    }
  }

  function showContextPopup(id: string, index: number) {
    setPopupArticleId(id);
    setPopupWordIndex(index);
  }

  function hidePopup() {
    setPopupArticleId("");
    setPopupWordIndex(-1);
  }

  const [cardFilter, setCardFilter] = useState<CardFilterOption>("all");
  const [cardList, setCardList] = useState<Card[]>([]);
  const cardOptions: CardFilterOption[] = ["all", "exported", "unexported"];
  const [popupArticleId, setPopupArticleId] = useState("");
  const [popupWordIndex, setPopupWordIndex] = useState(-1);

  useEffect(() => {
    axios
      .get("/api/cardList", {
        params: {
          userId: localStorage.getItem("userId"),
        },
      })
      .then((data) => {
        if (data.data.data.length === 0) {
          toast.error("您还没有添加任何卡片，请在文章里选择单词添加哦");
        }
        setCardList(data.data.data);
      });
  }, []);

  return (
    <>
      <div className="card-list-banner">
        <div>
          <img
            src={back}
            width="35"
            onClick={() => {
              history.goBack();
            }}
          />
        </div>
        {/* <select value={cardFilter} onChange={onCardFilterSelectorChange}>
          <option value={cardOptions[0]}>全部</option>
          <option value={cardOptions[1]}>已导出</option>
          <option value={cardOptions[2]}>未导出</option>
        </select> */}
        {/* <button onClick={exportCard}>导出Anki牌组</button> */}
      </div>
      <div className="card-list">
        {filterCardListByType(cardList, cardFilter).map((card, index) => (
          <WordCard
            {...card}
            onShowContextPopup={showContextPopup}
            defaultState="show"
            key={index}
            onDelete={() => {
              setCardList((cardList) =>
                cardList.filter((c) => c._id !== card._id)
              );
            }}
          ></WordCard>
        ))}
      </div>
      {popupArticleId && popupWordIndex >= 0 ? (
        <ReaderPopup
          articleId={popupArticleId}
          highlights={[popupWordIndex]}
          onClose={hidePopup}
        />
      ) : null}
    </>
  );
}
