var models_user = global.models.user;
var connection = global.mongodb.server;
plugdo.collector("mongoInsert", {
  type: "db",
  action: "mongodb",
  server: connection,
  collection: "plugdo",
  queryType: "insert",
  node_env: "",
  schema: [models_user],
  parameter: []
});
