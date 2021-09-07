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
import { useConfirm } from "material-ui-confirm";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { ArrowBack, Delete, CloudDownload } from "@material-ui/icons";

const { Filesystem, Share } = Plugins;
type CardFilterOption = "all" | "exported" | "unexported";

export default function CardList() {
  const history = useHistory();
  const browser = detect();
  const confirm = useConfirm();
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
        setCardList(data.data.data.map((c) => ({ ...c, checked: false })));
      });
  }, []);

  const exportApkg = () => {
    confirm({ title: "是否导出为Anki牌组?" }).then(() => {
      const cardIds = cardList.filter((c) => c.checked).map((c) => c._id);
      const promise = axios
        .post("/api/generateApkg", {
          cardIds,
        })
        .then((data) => {
          const fileName = data.data.data.fileName;
          window.open(`/api/downloadApkg/${fileName}`);
        });
      toast.promise(promise, {
        loading: "正在生成apkg",
        success: "开始下载",
        error: "导出失败",
      });
    });
  };

  return (
    <>
      <div className="card-list-banner">
        <IconButton
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBack></ArrowBack>
        </IconButton>

        {cardList.some((c) => c.checked) ? (
          <div>
            {/* <IconButton>
              <Delete></Delete>
            </IconButton> */}
            <IconButton onClick={exportApkg}>
              <CloudDownload></CloudDownload>
            </IconButton>
          </div>
        ) : null}
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
            onCheckChange={(checked) => {
              setCardList((cardList) => {
                return cardList.map((c) => {
                  if (c._id === card._id) {
                    return { ...c, checked };
                  }
                  return c;
                });
              });
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
