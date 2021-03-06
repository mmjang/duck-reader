import "./ArticleList.css";

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ArticleCard from "../../components/articlecard/ArticleCard";
import { ArticleItem } from "../../types/types";

export default function ArticleList({ sourceUrl }: { sourceUrl: string }) {
  const [newsList, setNewsList] = useState<ArticleItem[]>([]);

  useEffect(() => {
    (async () => {
      const result: ArticleItem[] = await fetch(sourceUrl).then((r) =>
        r.json()
      );
      setNewsList(result);
    })();
  }, [sourceUrl]);

  const history = useHistory();

  function handleClick(id: string) {
    history.push(`/article/${id}`);
  }

  return (
    <div>
      {newsList.map((item) => (
        <ArticleCard
          title={item.title}
          imgUrl={item.img}
          summary={item.description}
          key={item.id}
          clickHandler={() => handleClick(item.id)}
        ></ArticleCard>
      ))}
    </div>
  );
}
