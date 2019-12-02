const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var modelValidation = require("./modelValidation").validation()
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
    collection: "",
    queryType: "",
    node_env: "",
    schema: [],
    parameter: []
  },
  get: function (message, send) {
    var self = this;

    this.connect = function () {
      if (validateConnect(this.options) == true) {
        const dbName = this.options.server.db;
        const client = new MongoClient(stringConnectionUrl(this.options), {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        client.connect(function (err) {
          if (err != null) {
            fumc_errMongo(err, send)
          } else {
            const db = client.db(dbName);
            self.connectSuccess(db, self.options.schema)
            client.close();
          }

        });

      } else {
        throw new Error("Mongodb Conection Failed");
      }
    }

    this.connectSuccess = function (db, schema) {
      MongoCommands[validateQueryType(this.options)]({
        collection: this.options.collection,
        db: db,
        schema: schema,
        message: message
      }, send);

    }

    this.connect()
  }

}

var MongoCommands = {
  "insert": new MongoActions().insert,
  "update": new MongoActions().update,
  "delete": new MongoActions().delete,
  "select": new MongoActions().select,
  "count": new MongoActions().count,
  "dataExpiration": new MongoActions().dataExpiration,
  "notFound": new MongoActions().notFound
}

function MongoActions() {

  this.insert = function (options, send) {
    var response = modelValidation.validate(options.schema[0], options.message.data[0])
    if (response.success != false) {
      const collection = options.db.collection(options.collection);
      
      collection.insertMany(options.message.data, function (err, insert) {
        if (err) {
          send({}, err)
        } else {
          send({
            ok: true,
            Rows: insert
          });
        }
      })
    } else {
      send(response)
    }
  }

  this.select = function (options, send) {
    const collection = options.db.collection(options.collection);
    collection.find(options.message.find).skip(options.message.skip.value).limit(options.message.limit.value).toArray(function (err, result) {
      assert.equal(err, null);
      send({
        ok: true,
        Rows: result
      })
    });
  }


  this.update = function (options, send) {
    const collection = options.db.collection(options.collection);
    var FindId = {
      find: options.message.updateBy
    };

    var newValues = {
      $set: options.message.newData
    };

    collection.updateOne(FindId.find, newValues, {}, (err, update) => {
      if (err) {
        send({
          ok: false,
        }, err);
      }
      send({
        ok: true,
        result: update
      });
    });
  }

  this.delete = function (options, send) {
    const collection = options.db.collection(options.collection);
    var documentDelete = options.message.deleteBy.remove;
    collection.findByIdAndRemove(documentDelete, (err, deleteData) => {
      if (err) {
        send({}, err);
      }
      send({
        ok: true,
        result: deleteData
      });
    });
  }

  this.count = function (options, send) {
    const collection = options.db.collection(options.collection);
    collection.countDocuments(options.message.count, function (err, insert) {
      if (err) {
        send({}, err)
      } else {
        send({
          ok: true,
          Rows: insert
        });
      }
    });
  }

  this.dataExpiration = function (options, send) {
    collection = options.db.collection(options.collection);
    collection.createIndex(options.createExp.exp, function (err, expire) {
      if (err) {
        send({}, err)
      } else {
        send({
          ok: true,
          Rows: expire
        })
      }
    })
  }

  this.notFound = function (options, send) {
    throw new Error('the QueryType  is not found ');
  }

}

var validateConnect = function (validate) {
  if (validate.node_env === "dev" && validate.node_env != "" && validate.node_env != "prod") {
    if (validate.server.host != "" && validate.server.db != "") {
      return true;
    } else {
      return false;
    }
  }
  if (validate.server.user != "" && validate.server.password != "" && validate.server.host != "" && validate.server.db != "") {
    return true;
  } else {
    return false;
  }
}

var validateQueryType = function (options) {
  if (options.queryType === "insert" || options.queryType === "update" || options.queryType === "delete" || options.queryType === "select" || options.queryType === "count" || options.queryType === "dataExpiration") {
    return options.queryType;
  } else {
    var notFount = "notFound"
    return notFount;
  }
}

var stringConnectionUrl = function (ConnectionStringDB) {
  if (ConnectionStringDB.node_env === "" || ConnectionStringDB.node_env === "prod") {
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

var fumc_errMongo = function (err, send) {
  var error = send({
    err: true,
    response: err
  })
  return error;
}

exports.mongodb = function () {
  return mongodb;
};