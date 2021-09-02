/**
 * usage:
 * cd to this dir
 * mongosh
 * load('makeDictionary.js')
 */
const conn = new Mongo();
const db = conn.getDB("duck");
db.collins.drop();

const collins = require("./data/collins.json");
db.collins.insertMany(collins);
db.collins.createIndex({ hwd: 1 });

const forms = require("./data/forms.json");
forms.forEach((f) => {
  f.bases = f.bases.split("@@@").filter((s) => s);
});
db.forms.drop();
db.forms.insertMany(forms);
db.forms.createIndex({ hwd: 1 });
