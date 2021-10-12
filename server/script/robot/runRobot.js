const axios = require("axios");

async function runRobot({ username, password, urlExtractor }) {
  // before login, make sure the account exists by register it
  await axios.post("https://duck-reader.com/api/register", {
    username,
    password,
  });
  // login
  const token = (
    await axios.post("https://duck-reader.com/api/login", {
      username,
      password,
    })
  ).data.data.token;
  const urls = await urlExtractor();
  console.log("urls to load are fetched");
  console.log(urls);
  for (let url of urls) {
    try {
      console.log("start submitting " + url);
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
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = runRobot;
