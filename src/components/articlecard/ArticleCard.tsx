import { useHistory } from "react-router-dom";
import { User } from "../../types/types";
import { Card, CardContent, Link } from "@material-ui/core";
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
    <Card className="article-item" onClick={clickHandler}>
      <CardContent>
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
          <span className="comment">{description}</span>
        </div>
        {imgUrl ? (
          <div className="img-wrapper">
            <img src={imgUrl} className="img" />
          </div>
        ) : null}
        <div
          className="title"
          dangerouslySetInnerHTML={{ __html: title }}
        ></div>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: summary }}
        ></div>
        <div className="hostname">
          <Link
            href={url}
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {hostname.replace("www.", "")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
