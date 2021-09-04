import axios from "axios";
import React, {
  ElementRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../../api/index";
import Reader from "../../components/reader/Reader";
import { Article } from "../../types/types";
import Myreader from "../myreader/Myreader";
import "./ReaderPopup.css";

type Props = {
  articleId: string;
  highlights?: number[];
  onClose?: () => void;
};

export default function ReaderPopup({
  articleId,
  highlights = [],
  onClose = undefined,
}: Props) {
  const [articleHtml, setArticleHtml] = useState("");
  const readerRef = useRef<ElementRef<typeof Myreader>>(null);

  useEffect(() => {
    axios
      .get("/api/articleDetail", {
        params: {
          articleId,
        },
      })
      .then((data) => {
        setArticleHtml(data.data.data.content);
        console.log("reader ref", readerRef.current);
        readerRef.current?.scrollToHighlight();
      });
  }, []);

  return (
    <div className="reader-popup-wrapper">
      <div className="blank-area" onClick={onClose}></div>
      <div className="reader-popup">
        {articleHtml ? (
          <Myreader
            html={articleHtml}
            ref={readerRef}
            highlights={highlights.map((h) => ({
              start: h,
              end: h + 1,
              type: "word",
            }))}
          ></Myreader>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
