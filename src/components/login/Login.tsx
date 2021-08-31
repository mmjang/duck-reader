import "./Login.css";
import duck from "../../asset/duck.png";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "../../utils/hooks";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const query = useQuery();

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    axios
      .post("/api/login", {
        username,
        password,
      })
      .then((data) => {
        if (data.data.success) {
          localStorage.setItem("token", data.data.data.token);
          const redirectUrl = query.get("redirect");
          if (redirectUrl) {
            window.location.href = decodeURIComponent(redirectUrl);
          } else {
            window.location.href = "/";
          }
        }
      });
  };

  return (
    <div className="login">
      <div>
        <img src={duck} />
      </div>
      <h1>{"请您登录"}</h1>
      <div className="username">
        <label>用户名：</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onUsernameChange}
        ></input>
      </div>
      <div className="password">
        <label>密 码：</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onPasswordChange}
        ></input>
      </div>
      <div className="loginbutton">
        <button onClick={onSubmit}>登录</button>
      </div>
    </div>
  );
}
