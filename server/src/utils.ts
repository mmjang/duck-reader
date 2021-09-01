import User from "./model/User";

export function getCleanedUser(user: User) {
  const copied = JSON.parse(JSON.stringify(user));
  delete copied.iat;
  delete copied.hash;
  delete copied.exp;
  return copied;
}

export function isChineseContent(content: string) {
  const threshhold = 0.1;
  let count = 0;
  const stripped = content.replace(/[\t\n\r\w]/g, "");
  for (let c of stripped) {
    if (c.match(/[\u4E00-\u9FFF]/)) {
      count++;
    }
  }
  console.log(count, stripped.length);
  return count / stripped.length > threshhold;
}
