var UserSchema = function () {
  var schema = {
    email: {
      required: true,
      email: true,
      unique: true,
      code:551
    },
    password: {
      required: true,
      code:520
    },
    requestedOn:{
      required:true,
      code:562,
      type:Date
    }
  }

  return schema;
}

exports.UserSchema = function () {
  return UserSchema();
}