
const globalPath = process.env.PLUGDO_GLOBAL_PATH || "./source/model.config.js";
const mongoConnection = process.env.PLUGDO_GLOBAL_PATH || "./source/mongo.config.js";
global.models = require(globalPath).models()[process.env.PLUGDO_GLOBAL_ENV || 'schema'];
global.mongodb = require(mongoConnection).mongodbConnection()[process.env.PLUGDO_GLOBAL_ENV || 'db'];

const plugdo = require("plugdo-node").node();
const path = require("path");
const mongodb_connect = require("./mongodb");
plugdo.registerConnector("db", "mongodb", mongodb_connect.mongodb());
plugdo.start(4000, path.resolve(__dirname));
