import "./ArticleList.css";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArticleCard from "../../components/articlecard/ArticleCard";
import { ArticleItemNew } from "../../types/types";
import axios from "axios";

const bookJsonUrl = (id: string) => `/calibre/${id}/book.json`;

export default function ArticleList({ userId }: { userId?: string }) {
  const [newsList, setNewsList] = useState<ArticleItemNew[]>([]);
  // const params = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      const result: ArticleItemNew[] = await axios
        .get("/api/articleList", {
          params: {
            userId: userId ? userId : "",
          },
        })
        .then((data) => {
          return data.data.data;
        });
      setNewsList(result);
    })();
  }, []);

  const history = useHistory();

  function handleClick(id: string) {
    history.push(`/article/${encodeURIComponent(id)}`);
  }

  return (
    <div className="article-list">
      {newsList
        .filter((a) => a.length > 200)
        .map((item) => (
          <ArticleCard
            articleId={item._id}
            title={item.title}
            url={item.url || ""}
            summary={item.excerpt}
            hostname={item.hostname || ""}
            description={item.description || ""}
            key={item._id}
            user={item.user}
            clickHandler={() => handleClick(item._id)}
            onDelete={() => {
              setNewsList((newsList) => {
                return newsList.filter((c) => c._id !== item._id);
              });
            }}
          ></ArticleCard>
        ))}
    </div>
  );
}
