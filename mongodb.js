const Mongodblib = require('./db/lib/entity').Entity()
const mongodb = {
  callback: true,
  options: {
    server: {
      user: "",
      password: "",
      host: "",
      db: "",
      options: ""
    },
    db: "",
    collection: "",
    queryType: "",
    node_env: "prod",
    validateExist: false,
    exclude: {},
    cache: {},
    schema: [],
    parameter: []
  },
  get: function (message, params, send) {
    if (typeof params === "function") {
      send = params;
    }
    if (validateConnect(this.options) === true) {
      this.connectSuccess = function () {
        MongoCommands[validateQueryType(this.options)]({
          connection: stringConnectionUrl(this.options),
          collection: this.options.collection,
          db: this.options.db,
          schema: this.options.schema,
          queryType: this.options.queryType,
          exist: this.options.validateExist,
          exclude: this.options.exclude,
          cache: this.options.cache,
          message: message,
          params: params,
        }, send);

      }
      this.connectSuccess();
    }
  }
}

var MongoCommands = {
  "insert": new MongoActions().insert,
  "update": new MongoActions().update,
  "delete": new MongoActions().delete,
  "select": new MongoActions().select,
  "notFound": new MongoActions().notFound
}

function MongoActions() {

  this.insert = async function (options, send) {
    var table = MongoClient(options);
    var query = Getdata(options);
    if (options.exist != true) {
      var response = await table.add(query);
    } else {
      var exist = await table.has(query);
      if (exist.success != true) {
        var response = await table.add(query);
      } else {
        var response = exist;
      }
    }
    send(response);
  }

  this.select = async function (options, send) {
    var table = MongoClient(options);
    var query = Getdata(options);
    if (Object.keys(options.exclude).length != 0) {
      var response = await table.get(query, options.exclude);
    } else {
      var response = await table.get(query);
    }
    send(response)
  }

  this.update = async function (options, send) {
    var table = MongoClient(options);
    var find = options.message;
    var query = options.params;
    var exist = await table.get(find);
    if (exist.success === true) {
      var response = await table.change(find, query);
    } else {
      response = exist
    }
    send(response)
  }

  this.delete = async function (options, send) {
    var table = MongoClient(options);
    var query = Getdata(options);
    var exist = await table.has(query)
    if (exist.success) {
      var response = await table.remove(query)
    } else {
      var response = {
        error: "the model is not found in the collection",
        errorCode: "601",
        success: false
      }
    }
    send(response)
  }

  this.notFound = function (options, send) {
    var error = {
      error: `The name of querytype '${options.queryType}' is not found in this connector`,
      success: false,
      code: 404,
      data: []
    }
    send(error)
  }

}


var Getdata = function (options) {
  if (options.message.post != undefined && Object.keys(options.message.post).length != 0) {
    return options.message.post;
  } else {
    if (options.message.querystring != undefined && Object.keys(options.message.querystring).length != 0) {
      return options.message.querystring
    } else {
      return options.message
    }
  }
}

var MongoClient = function (options) {
  var cache = setDataCache(options);
  var table = Mongodblib.server(options.connection)
    .db(options.db, cache)
    .table(options.schema, options.collection);
  return table;
}

var setDataCache = function (options) {
  var cacheData = []

  cacheData.push({
    cache: {
      collection: options.collection,
      field: options.cache.field,
      seconds: options.params.seconds
    }
  })
  return cacheData[0]

}

var validateConnect = function (validate) {
  if (validate.node_env === "dev" && validate.node_env != "" && validate.node_env != "prod") {
    if (validate.host != "" && validate.db != "") {
      return true;
    } else {
      return false;
    }
  } else {
    if (validate.node_env === "" && validate.node_env != "dev") {
      return true;
    } else {
      return false;
    }
  }
}

var validateQueryType = function (options) {
  if (options.queryType === "insert" || options.queryType === "update" || options.queryType === "delete" || options.queryType === "select") {
    return options.queryType;
  } else {
    var notFount = "notFound"
    return notFount;
  }
}

var stringConnectionUrl = function (ConnectionStringDB) {
  if (ConnectionStringDB.node_env === "" || ConnectionStringDB.node_env === "prod" && ConnectionStringDB.node_env === undefined) {
    var conectionString = `mongodb+srv://${ConnectionStringDB.server.user}:${ConnectionStringDB.server.password}@${ConnectionStringDB.server.host}/${ConnectionStringDB.server.db}?${ConnectionStringDB.server.options}`;
    return conectionString;
  } else {
    if (ConnectionStringDB.server.password != "" && ConnectionStringDB.server.password != undefined) {
      var conectionString = `mongodb://${ConnectionStringDB.server.user}:${ConnectionStringDB.server.password}@${ConnectionStringDB.server.host}/${ConnectionStringDB.server.db}`;
      return conectionString;
    } else {
      var conectionString = `mongodb://${ConnectionStringDB.server.host}`;
      return conectionString;
    }

  }

}

exports.mongodb = function () {
  return mongodb;
};
