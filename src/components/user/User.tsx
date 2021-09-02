import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User } from "../../types/types";
import ArticleList from "../articlelist/ArticleList";
import "./User.css";
export default function UserPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    axios
      .get("/api/userinfo", {
        params: {
          userId: params.id,
        },
      })
      .then((data) => {
        setUser(data.data.data);
      });
  }, []);
  return (
    <div className="user">
      <div className="userinfo">
        <div>
          <Link to="/">回首页</Link>
        </div>
        用户<span className="username">@{user?.name}</span>的主页
        <div>ta分享的文章：</div>
      </div>
      <ArticleList userId={params.id}></ArticleList>
    </div>
  );
}
