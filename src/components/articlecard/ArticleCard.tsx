import "./ArticleCard.css";

export default function NewsCard({
  title,
  imgUrl,
  summary,
  clickHandler,
}: {
  title: string;
  imgUrl: string;
  summary: string;
  clickHandler: () => void;
}) {
  return (
    <div className="article-item" onClick={clickHandler}>
      <div className="img-wrapper">
        <img src={imgUrl} className="img" />
      </div>
      <div className="title">{title}</div>
      <div className="description">{summary}</div>
    </div>
  );
}
