import { useHistory } from "react-router-dom";
import { User } from "../../types/types";
import { Card, CardContent, Link, Button } from "@material-ui/core";
import { useConfirm } from "material-ui-confirm";
import "./ArticleCard.css";
import React from "react";
import axios from "axios";

export default function NewsCard({
  articleId,
  title,
  hostname,
  imgUrl,
  summary,
  description,
  user,
  url,
  clickHandler,
  onDelete,
}: {
  articleId: string;
  title: string;
  hostname: string;
  imgUrl?: string;
  summary: string;
  description: string;
  user: User;
  url: string;
  clickHandler: () => void;
  onDelete: () => void;
}) {
  const history = useHistory();
  const confirm = useConfirm();

  function deleteArticle(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    confirm({ title: "确定要删除吗" }).then(() => {
      axios.post("/api/deleteArticle", { articleId }).then((data) => {
        if (data.data.success) {
          onDelete();
        }
      });
    });
  }

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

          {user._id === localStorage.getItem("userId") ? (
            <Button variant="text" onClick={deleteArticle} color="secondary">
              删除
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
