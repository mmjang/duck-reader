import { card } from "../../api/card";
import WordCard from "../wordcard/WordCard";
// @ts-ignore
import AnkiExport from "anki-apkg-export";
import "./CardList.css";
import { bracketToBoldTag } from "../../utils/tags";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
  Capacitor,
} from "@capacitor/core";
import toast from "react-hot-toast";
import { useState } from "react";
import { useLocalStorage } from "../../utils/hooks";
import { Card } from "../../types/types";
import { exportApkg } from "../../api/export";
import ReaderPopup from "../readerpopup/ReaderPopup";
import { detect } from "detect-browser";

const { Filesystem, Share } = Plugins;
type CardFilterOption = "all" | "exported" | "unexported";

export default function CardList() {
  const browser = detect();
  async function exportCard() {
    try {
      // if (
      //   browser?.os?.includes("Android") ||
      //   (browser?.os?.includes("iOS") &&
      //     browser.name !== "safari" &&
      //     browser.name !== "ios")
      // ) {
      //   console.log(browser);
      //   toast("目前导出牌组功能仅支持电脑和iOS Safari。安卓App即将推出。");
      //   return;
      // }
      const exportedCards = filterCardListByType(cardList, cardFilter);
      await exportApkg(exportedCards, "duck-reader.apkg", "duck-reader");
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
  const [cardList, setCardList] = useState<Card[]>(card.getCardList());
  const cardOptions: CardFilterOption[] = ["all", "exported", "unexported"];
  const [popupArticleId, setPopupArticleId] = useState("");
  const [popupWordIndex, setPopupWordIndex] = useState(-1);
  return (
    <>
      <div className="card-list-banner">
        <select value={cardFilter} onChange={onCardFilterSelectorChange}>
          <option value={cardOptions[0]}>全部</option>
          <option value={cardOptions[1]}>已导出</option>
          <option value={cardOptions[2]}>未导出</option>
        </select>
        <button onClick={exportCard}>导出Anki牌组</button>
      </div>
      <div className="card-list">
        {filterCardListByType(cardList, cardFilter).map((card, index) => (
          <WordCard
            {...card}
            onShowContextPopup={showContextPopup}
            defaultState="show"
            key={index}
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
