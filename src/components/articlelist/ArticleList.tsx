import "./ArticleList.css";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArticleCard from "../../components/articlecard/ArticleCard";
import { ArticleItem, ArticleItemNew } from "../../types/types";

const bookJsonUrl = (id: string) => `/calibre/${id}/book.json`;

export default function ArticleList() {
  const [newsList, setNewsList] = useState<ArticleItemNew[]>([]);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      const result: ArticleItemNew[] = await fetch(bookJsonUrl(params.id))
        .then((r) => r.json())
        .then((j) => j.articleList);
      setNewsList(result);
    })();
  }, [params]);

  const history = useHistory();

  function handleClick(id: string) {
    history.push(`/article/${encodeURIComponent(id)}`);
  }

  return (
    <div className="article-list">
      {newsList
        .filter((a) => a.length > 200)
        .map((item, index) => (
          <ArticleCard
            title={item.title}
            imgUrl={item.image}
            summary={item.excerpt}
            key={index}
            clickHandler={() => handleClick(item.articleJson)}
          ></ArticleCard>
        ))}
    </div>
  );
}
