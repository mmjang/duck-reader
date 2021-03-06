import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/index";
import Reader from "../../components/reader/Reader";
import { Article } from "../../types/types";

export default function ReaderView() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [article, setArticle] = useState<Article>();
  useEffect(() => {
    async function getArticle() {
      setArticle(await api.getArticleDetail(id));
    }
    getArticle();
  }, []);
  return (
    <div className="App">{article ? <Reader {...article}></Reader> : ""}</div>
  );
}
