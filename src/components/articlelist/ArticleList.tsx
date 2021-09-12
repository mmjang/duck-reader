import "./ArticleList.css";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArticleCard from "../../components/articlecard/ArticleCard";
import { ArticleItemNew } from "../../types/types";
import axios from "axios";

const PER_PAGE = 50;

export default function ArticleList({ userId }: { userId?: string }) {
  const [newsList, setNewsList] = useState<ArticleItemNew[]>([]);
  const [hasNext, setHasNext] = useState(true);
  // const params = useParams<{ id: string }>();
  const loadNext = () => {
    (async () => {
      const result: ArticleItemNew[] = await axios
        .get("/api/articleList", {
          params: {
            userId: userId ? userId : "",
            perpage: PER_PAGE,
            page: Math.floor(newsList.length / PER_PAGE) + 1,
          },
        })
        .then((data) => {
          if (
            data.data.data.articles.length + newsList.length ===
            data.data.data.total
          ) {
            setHasNext(false);
          }
          return data.data.data.articles;
        });
      setNewsList((list) => list.concat(result));
    })();
  };

  useEffect(() => {
    loadNext();
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
      {hasNext ? (
        <div className="load-more">
          <div className="load-more-button" onClick={loadNext}>
            加载更多
          </div>
        </div>
      ) : (
        <div className="load-more">
          <div className="load-more-button">已经到底了</div>
        </div>
      )}
    </div>
  );
}
