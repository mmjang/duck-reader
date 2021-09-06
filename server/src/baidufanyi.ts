import axios from "axios";
import { cryptPwd } from "./hash";

var appid = "20160220000012831";
var key = "ISSPx0K_ZyrUN9IAOKel";

export function baiduFanyi(word: string) {
  var salt = new Date().getTime();
  var query = word;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = "en";
  var to = "zh";
  var str1 = appid + query + salt + key;
  var sign = cryptPwd(str1);
  return axios
    .get("http://api.fanyi.baidu.com/api/trans/vip/translate", {
      params: {
        q: word,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
      },
    })
    .then((data) => data.data);
}
