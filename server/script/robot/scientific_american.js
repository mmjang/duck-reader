const username = "科学美国人";
const password = "paitsaml";

(async () => {
  const token = (
    await axios.post("https://duck-reader.com/api/login", {
      username,
      password,
    })
  ).data.data.token;
  console.log(token);
  const text = (
    await axios.get("http://rss.sciam.com/ScientificAmerican-Global")
  ).data;
  console.log(text);
  const pattern =
    /<link>(https:\/\/www\.scientificamerican\.com\/article\/.+?)<\/link>/;
  for (let line of text.split("\n").reverse()) {
    const match = line.match(pattern);
    if (match) {
      const url = match[1];
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
})();
