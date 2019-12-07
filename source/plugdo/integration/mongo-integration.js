plugdo.integration("mongo-connector", (message, send) => {
  let response = {};


  var dataInsert = {
    "email": "abdielantonio.af@gmail.com",
    "password": "65454694635468",
    "requestedOn": new Date(),
  }

  var cache = {
    seconds: 60
  }

  var select = {
    email: "abdielantonio.af@gmail.com",
  }

  var find = {
    email: "abdielantonio.af@gmail.com"
  }

  var update = {
    "email": "aflores@digitalprimeint.com",
    "password": "123456",
    "requestedOn": new Date(),
  }

  var deleteData = {
    email:"aflores@digitalprimeint.com"
  }




  //  console.log(message)
  plugdo.collect("mongoInsert").get(find,update,function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })

});