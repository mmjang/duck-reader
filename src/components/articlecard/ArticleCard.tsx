import "./ArticleCard.css";

export default function NewsCard({
  title,
  imgUrl,
  summary,
  clickHandler,
}: {
  title: string;
  imgUrl?: string;
  summary: string;
  clickHandler: () => void;
}) {
  return (
    <div className="article-item" onClick={clickHandler}>
      {imgUrl ? (
        <div className="img-wrapper">
          <img src={imgUrl} className="img" />
        </div>
      ) : null}
      <div className="title" dangerouslySetInnerHTML={{ __html: title }}></div>
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: summary }}
      ></div>
    </div>
  );
}
