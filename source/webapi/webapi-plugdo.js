
mvc.api({
  name:"connector",
  action:"mongodb",
  methods:{
    post:insertData
  }
},function(req,send){
  console.log(req)
})


function insertData (req,send){
  response = {}
  plugdo.collect("mongoInsert").get(req.plugdo, function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })
}