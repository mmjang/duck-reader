import React, { useEffect, useState } from "react";
import { api } from "../../api/index";
import Reader from "../../components/reader/Reader";
import { Article } from "../../types/types";
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
  const [article, setArticle] = useState<Article>();
  useEffect(() => {
    async function getArticle() {
      setArticle(await api.getArticleDetail(articleId));
    }
    getArticle();
  }, [articleId]);
  return (
    <div className="reader-popup-wrapper">
      <div className="blank-area" onClick={onClose}></div>
      <div className="reader-popup">
        {article ? (
          <Reader
            {...article}
            highlights={highlights}
            selectable={false}
          ></Reader>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
