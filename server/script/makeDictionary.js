const conn = new Mongo();
const db = conn.getDB("duck");
db.collins.drop();

const collins = require("./data/collins.json");
db.collins.insertMany(collins);
db.collins.createIndex({ hwd: 1 });
