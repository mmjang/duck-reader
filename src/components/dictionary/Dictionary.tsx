import { useEffect, useState } from "react";
import { collins } from "../../api/collins";
import { DictResultEntry } from "../../types/types";
import Definition from "../definition/Definition";
import "./Dictionary.css";
import arrowUp from "./arrow-up.svg";
import arrowDown from "./arrow-down.svg";
import close from "./close.svg";
import loading from "./loading.gif";
import { card } from "../../api/card";
import WordTile from "../wordtile/WordTile";
import toast from "react-hot-toast";

interface Props {
  word: string;
  sentence?: string;
  articleId: string;
  wordIndex: number;
  onClose: () => void;
}

type DisplayMode = "compact" | "full";

export default function Dictionary({
  word,
  sentence = "",
  articleId,
  wordIndex,
  onClose,
}: Props) {
  console.log("rerender");
  const [definitionList, setDefinitionList] = useState<DictResultEntry[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("compact");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function loadDefiniton() {
      try {
        setIsLoading(true);
        setMessage("");
        const result = await collins.search(word);
        setDefinitionList(result);
        if (result.length === 0) {
          setMessage("没查到这个词.");
        }
      } catch {
        setMessage("网络错误.");
      } finally {
        setIsLoading(false);
      }
    }
    loadDefiniton();
  }, [word]);

  function addDefinition(def: DictResultEntry): void {
    card.addCard({
      id: Date.now().toString(),
      originalWord: word,
      sentence,
      articleId,
      wordTileIndex: wordIndex,
      dictResult: def,
      addTime: Date.now(),
    });
    toast.success("添加成功");
  }

  const iconRow = (
    <div
      className="icon-row"
      onClick={() =>
        setDisplayMode(displayMode === "full" ? "compact" : "full")
      }
    >
      <img
        src={displayMode === "full" ? arrowDown : arrowUp}
        className="expand-icon"
      />
      <img src={close} className="close-icon" onClick={onClose} />
    </div>
  );
  if (isLoading) {
    return (
      <div className="dictionary">
        {iconRow}
        <div className="loading">
          <img src={loading} />
        </div>
      </div>
    );
  }
  if (displayMode === "full") {
    return (
      <div className="dictionary">
        {iconRow}
        <div className="message">{message}</div>
        {definitionList.map((d, i) => (
          <div key={i} className="definition-wrapper">
            <Definition {...d} onAdd={() => addDefinition(d)}></Definition>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="dictionary compact">
        {iconRow}
        <div className="message">{message}</div>
        {definitionList.map((d, i) => (
          <span key={i} className="tag">
            {d.shortDefinition}
          </span>
        ))}
      </div>
    );
  }
}
