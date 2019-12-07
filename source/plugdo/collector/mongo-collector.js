var schemaUser = require('../table/user-schema').UserSchema();
plugdo.collector("mongoInsert", {
  type: "db",
  action: "mongodb",
  server: global.config.mongo,
  db: "plugdoconnector",
  collection: "plugdo",
  queryType: "delete",
  validateExist:true,
  node_env: "dev",
  exclude:{password:0},
  cache: {
    field: "requestedOn"
  },
  schema: schemaUser
});
