import "./Login.css";
import duck from "../../asset/duck.png";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "../../utils/hooks";
import { Button, TextField, Link } from "@material-ui/core";
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
      <div className="login-banner">
        <Link href="/">首页</Link>
      </div>
      <div className="logo">
        <img src={duck} />
      </div>
      <div className="username">
        <TextField
          className="userName_input"
          type="text"
          name="username"
          label="用户名"
          value={username}
          onChange={onUsernameChange}
        ></TextField>
      </div>
      <div className="password">
        <TextField
          className="password_input"

          type="password"
          name="password"
          label="密码"
          value={password}
          onChange={onPasswordChange}
        ></TextField>
      </div>
      <div className="loginbutton">
        <Button onClick={onSubmit} color="primary" variant="contained">
          登录
        </Button>
      </div>
      <div className="loginbutton">
        <Button href="/register" variant="contained">
          注册
        </Button>
      </div>
    </div>
  );
}
