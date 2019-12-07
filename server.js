const plugdo = require("plugdo-node").node();
const path = require("path");
global.config = {
  mongo: {
    user: "",
    password: "",
    host: "localhost:27017",
    options: ""
  }
};

const mongodb_connect = require("./mongodb");
plugdo.registerConnector("db", "mongodb", mongodb_connect.mongodb());
plugdo.start(4000, path.resolve(__dirname));
