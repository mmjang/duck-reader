import "./Register.css";
import duck from "../../asset/duck.png";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "../../utils/hooks";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
export default function Register() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const query = useQuery();

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = () => {
    if (!username) {
      toast.error("用户名不能为空");
      return;
    }
    if (!password) {
      toast.error("密码不能为空");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("两次填入的密码不一致");
      return;
    }
    axios
      .post("/api/register", {
        username,
        password,
      })
      .then((data) => {
        if (data.data.success) {
          toast("注册成功");
          history.push("/login");
        }
      });
  };

  return (
    <div className="register">
      <div className="register-banner">
        <Link to="/">首页</Link>
        <Link to="/login">登录</Link>
      </div>
      <div className="logo">
        <img src={duck} />
      </div>
      <h1>{"请您注册"}</h1>
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

      <div className="password">
        <label>确认密码：</label>
        <input
          type="password"
          name="confirmpassword"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        ></input>
      </div>

      <div className="loginbutton">
        <button onClick={onSubmit}>注册</button>
      </div>
    </div>
  );
}
