import "./Register.css";
import duck from "../../asset/duck.png";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "../../utils/hooks";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { Button, TextField, Link } from "@material-ui/core";
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
        <Link href="/">首页</Link>
      </div>
      <div className="logo">
        <img src={duck} />
      </div>
      <div className="username">
        <TextField
          label="用户名"
          type="text"
          name="username"
          value={username}
          onChange={onUsernameChange}
        ></TextField>
      </div>
      <div className="password">
        <TextField
          label="密码"
          type="password"
          name="password"
          value={password}
          onChange={onPasswordChange}
        ></TextField>
      </div>

      <div className="password">
        <TextField
          label="确认密码"
          type="password"
          name="confirmpassword"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        ></TextField>
      </div>

      <div className="loginbutton">
        <Button onClick={onSubmit} color="primary" variant="contained">
          注册
        </Button>
      </div>

      <div className="loginbutton">
        <Button href="/login" variant="contained">
          去登录
        </Button>
      </div>
    </div>
  );
}
