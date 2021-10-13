import "./ArticleList.css";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArticleCard from "../../components/articlecard/ArticleCard";
import { ArticleItemNew } from "../../types/types";
import axios from "axios";

const PER_PAGE = 50;

export default function ArticleList({
  userId,
  favorate = false,
}: {
  userId?: string;
  favorate?: boolean;
}) {
  const [newsList, setNewsList] = useState<ArticleItemNew[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const loggedUserId = localStorage.getItem("userId");
  // const params = useParams<{ id: string }>();
  const loadNext = () => {
    (async () => {
      const result: ArticleItemNew[] = await axios
        .get("/api/articleList", {
          params: {
            userId: userId ? userId : "",
            perpage: PER_PAGE,
            page: Math.floor(newsList.length / PER_PAGE) + 1,
            favorate,
          },
        })
        .then((data) => {
          // 判断点赞状态
          data.data.data.articles.forEach((article) => {
            article.favorate = Boolean(
              loggedUserId && article.favoratedUserList?.includes(loggedUserId)
            );
          });
          /////////////
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
    setNewsList([]);
    loadNext();
  }, [favorate, userId]);

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
            creationDate={item.creationDate}
            clickHandler={() => handleClick(item._id)}
            favorate={item.favorate}
            onDelete={() => {
              setNewsList((newsList) => {
                return newsList.filter((c) => c._id !== item._id);
              });
            }}
            onFavorate={(status) => {
              item.favorate = status;
              setNewsList([...newsList]);
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
