import axios from "axios";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    axios
      .get("/api/articleDetail", {
        params: {
          articleId,
        },
      })
      .then((data) => {
        setArticleHtml(data.data.data.content);
      });
  }, []);

  return (
    <div className="reader-popup-wrapper">
      <div className="blank-area" onClick={onClose}></div>
      <div className="reader-popup">
        {articleHtml ? <Myreader html={articleHtml}></Myreader> : ""}
      </div>
    </div>
  );
}
