import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User } from "../../types/types";
import back from "../../asset/back.svg";

import "./Me.css";

function getRegisterTime(num: number) {
  const registerDate = new Date(num || 0);
  const Y = registerDate.getFullYear();
  const M = registerDate.getMonth() + 1 < 10 ? '0' + (registerDate.getMonth() + 1) : registerDate.getMonth() + 1;
  const D = registerDate.getDate();
  return Y + '-' + M + '-' + D;
}


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
      <img
        className="me_back_img"
        src={back}
        width="35"
        onClick={() => {
          history.goBack();
        }}
      />
      {/* <Link to="/">back</Link> */}
      <div className="me_name_box">
        <div>
          <h3 className="me_name">{user?.name}</h3>
          <h3 className="me_time">Register on &nbsp;
            {getRegisterTime(user?.creationDate)}
          </h3>
        </div>
      </div >
      <div className="me_logout_box">

        <div className="me_logout">

          <a
            className="me_logout_text"
            onClick={() => {
              localStorage.setItem("token", "");
              history.push("/");
            }}
          >
            退出登录
          </a>
        </div>
      </div>
    </div >
  );
}
