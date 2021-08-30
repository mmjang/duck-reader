import crypto from "crypto";

export function cryptPwd(password: string) {
  const md5 = crypto.createHash("md5");
  return md5.update(password).digest("hex");
}
