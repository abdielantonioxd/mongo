const mongodb = {
  db: {
    server: {
      user: "abdiel",
      password: "1997",
      host: "cluster0-xg7r9.mongodb.net",
      db: "plugdoconnector",
      options: "retryWrites=true&w=majority"
    }
  }
}

exports.mongodbConnection = function () {
  return mongodb;
};