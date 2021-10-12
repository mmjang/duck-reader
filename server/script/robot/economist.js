const axios = require("axios");
const runRobot = require("./runRobot");

const sectionList = [
  "https://www.economist.com/the-world-this-week/rss.xml",
  "https://www.economist.com/leaders/rss.xml",
  "https://www.economist.com/briefing/rss.xml",
  "https://www.economist.com/special-report/rss.xml",
  "https://www.economist.com/britain/rss.xml",
  "https://www.economist.com/europe/rss.xml",
  "https://www.economist.com/united-states/rss.xml",
  "https://www.economist.com/the-americas/rss.xml",
  "https://www.economist.com/middle-east-and-africa/rss.xml",
  "https://www.economist.com/asia/rss.xml",
  "https://www.economist.com/china/rss.xml",
  "https://www.economist.com/international/rss.xml",
  "https://www.economist.com/business/rss.xml",
  "https://www.economist.com/finance-and-economics/rss.xml",
  "https://www.economist.com/science-and-technology/rss.xml",
  "https://www.economist.com/books-and-arts/rss.xml",
  "https://www.economist.com/obituary/rss.xml",
  "https://www.economist.com/graphic-detail/rss.xml",
  "https://www.economist.com/economic-and-financial-indicators/rss.xml",
].reverse();

runRobot({
  username: "静寂血刃",
  password: "paitsam777",
  urlExtractor: async () => {
    for (let section of sectionList) {
      const text = (await axios.get(section)).data;
      console.log(text);
      const urls = [];
      for (let line of text.split("\n").reverse()) {
        let m = line.match(/<link>(https:\/\/www\.economist\.com.+?)<\/link>/);
        let dateMatch = line.match(/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/);
        if (m && dateMatch) {
          let [year, month, day] = [
            dateMatch[1],
            dateMatch[2],
            dateMatch[3],
          ].map((s) => parseInt(s));
          if (year > 2021 || (year == 2021 && month >= 10)) {
            urls.push(m[1]);
          }
        }
      }
    }
    return urls;
  },
});
