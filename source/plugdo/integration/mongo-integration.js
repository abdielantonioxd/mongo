plugdo.integration("mongo-connector", (message, send) => {
  let response = {};

dataInsert = {
    data: [
      {
        name:"abdiel",
        email:"abdiel@plugdo.com",
        password:"112145565"
      }
    
    ]
  }
  //  console.log(message)
  plugdo.collect("mongoInsert").get(dataInsert, function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })

});