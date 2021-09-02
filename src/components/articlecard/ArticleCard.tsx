import { useHistory } from "react-router-dom";
import { User } from "../../types/types";
import "./ArticleCard.css";

export default function NewsCard({
  title,
  hostname,
  imgUrl,
  summary,
  description,
  user,
  url,
  clickHandler,
}: {
  title: string;
  hostname: string;
  imgUrl?: string;
  summary: string;
  description: string;
  user: User;
  url: string;
  clickHandler: () => void;
}) {
  const history = useHistory();
  return (
    <div className="article-item" onClick={clickHandler}>
      <div className="user">
        <span
          className="username"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/user/${user._id}`);
          }}
        >
          @{user.name}
        </span>
        <span className="description">{description}</span>
      </div>
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
      <div className="hostname">
        <a
          href={url}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {hostname.replace("www.", "")}
        </a>
      </div>
    </div>
  );
}
