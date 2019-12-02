const models = {
schema : {
  user:{
    name: {
      required: true,
      typeof: "string",
      code: 550
    },
    email: {
      email: true,
      code: 551
    },
    password: {
      required: true,
      min: 8,
      max: 20,
      code: 552
    }
  }
}
} 

exports.models = function () {
  return models;
};