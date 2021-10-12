const axios = require("axios");
const runRobot = require("./runRobot");

runRobot({
  username: "静寂血刃",
  password: "paitsam777",
  urlExtractor: async () => {
    const text = (
      await axios.get(
        "https://www.economist.com/science-and-technology/rss.xml"
      )
    ).data;
    console.log(text);
    const urls = [];
    for (let line of text.split("\n")) {
      let m = line.match(/<link>(https:\/\/www\.economist\.com.+?)<\/link>/);
      if (m) {
        urls.push(m[1]);
      }
    }
    return urls;
  },
});
