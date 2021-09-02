import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/index";
import Reader from "../../components/reader/Reader";
import { Article } from "../../types/types";
import { useQuery } from "../../utils/hooks";

export default function ReaderView() {
  const params = useParams<{ id: string }>();
  const query = useQuery();
  const highlights = (query.get("highlights") || "")
    .split(" ")
    .filter((s) => s)
    .map(Number);
  console.log("hilights: ", highlights);
  const id = params.id;
  const [article, setArticle] = useState<Article>();
  useEffect(() => {
    async function getArticle() {
      setArticle(await api.getArticleDetail(id));
    }
    getArticle();
  }, [id]);
  return (
    <div className="App">
      {/* {article ? <Reader {...article} highlights={highlights}></Reader> : ""} */}
    </div>
  );
}
