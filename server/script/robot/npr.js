const axios = require("axios");

const username = "NPR机器人";
const password = "paitsaml";

(async () => {
  const token = (
    await axios.post("https://duck-reader.com/api/login", {
      username,
      password,
    })
  ).data.data.token;
  console.log(token);
  const text = (await axios.get("https://text.npr.org/")).data;
  for (let line of text.split("\n").reverse()) {
    if (line.includes("topic-title")) {
      const match = line.match(/href=\"(.+?)\"/);
      if (match) {
        const url = `https://npr.org/${match[1]}`;
        console.log(url);
        try {
          const article = await axios.post(
            `https://duck-reader.com/api/submitArticle`,
            {
              url,
              disableDuplicate: true,
            },
            {
              headers: {
                token,
              },
            }
          );
          console.log(article);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
})();
