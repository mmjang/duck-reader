import * as mongodb from "mongodb";

export let db: mongodb.Db = null;

export async function connect() {
  if (!db) {
    const MongoClient = mongodb.MongoClient;
    const url = "mongodb://localhost:27017/duck";
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("duck");
  }
}

type Col = "users" | "articles" | "collins" | "forms" | "cards";

export function collection(col: Col) {
  return db.collection(col);
}
