import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User } from "../../types/types";
import "./Me.css";
export default function Me() {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  useEffect(() => {
    axios.get("/api/userinfo").then((data) => {
      setUser(data.data.data);
    });
  }, []);
  return (
    <div className="me">
      <h3>用户名：{user?.name}</h3>
      <h3>注册日期：{new Date(user?.creationDate || 0).toString()}</h3>
      <Link to="/">回主页</Link>
      <br />
      <a
        onClick={() => {
          localStorage.setItem("token", "");
          history.push("/");
        }}
      >
        退出登录
      </a>
    </div>
  );
}
