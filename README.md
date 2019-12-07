#### connector Mongodb para Node.Js

este connector solo es para uso del modulo de __plugdo-node__,  Para bajar el modulo copie el  siguiemte Script 

```javascript 

```

Este connector tiene el CRUD completo a continución explicaremos el uso de cada uno de ellos 

#### Lista de comando para hacer el CRUD con mongo db 

**insert**
**select**
**update**
**delete**

### Ejemplos de usos de los comandos

##### **insert**
el dato que se le envia ya sea por post o queryString  debe ser un array o objeto, si va a validar si los datos que va a insertar coinciden con algunos de la base de datos en esa tabla la configuracion es la siguiente: 
```javascript
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
```

__Usted debe colocar en la configuración del schema un  campo o mas  como unique   para poder hacer la validacion  y  en el "collector" deve colocar la opción  "validateExist" como true  ejemplo__ : 


```javascript 
plugdo.collector("mongoTest", {
  type: "db",
  action: "mongodb",
  server: {
     user: "",
    password: "",
    host: "localhost:27017",
    options: ""
  },
  db:"plugdoconnector",
  collection: "plugdo",
  queryType: "insert",
  validateExist:true,
   cache: {
    field: "requestedOn",
    seconds: 60
  }
  schema: schemaUser
})

```
de lo contrario se agregara el campo sin validar si el campo  unico existe en la tabla en mongodb

__envio de datos ya sea por post,querystring o directamente__

##### Ejemplo de un insert 
se debe emviar un modelo  con toda la data que desea agregar __"el nombre de la propiedad de  cada objeto debe ser el mismo que en el schema de su tabla "__ : 
```javascript 
  {
    email: "abdiel@plugdo.com",
    password: "1121455e",
    requestedOn: new Date()
  }
```

 En este Ejemplo usaremos un  integrador, si usted usa un webApi en plugdo-node el uso es de la misma manera 
 ```javascript 
 plugdo.integration("mongo-connector", (message, send) => {
  let response = {};

  var dataInsert =  {
    email: "abdiel@plugdo.com",
    password: "1121455e",
    requestedOn: new Date()
  }

  plugdo.collect("mongoInsert").get(dataInsert, function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })

});
 ```
 La propiedad  __validateExist__ es la encargada de verificar si los datos que desea ingresar no coincidan con algunos de la tabla,   por defecto esta vacio y inserta el dato sin validar nada.
 para validar   se debe tener por lo menos un campo como __unique__ en el esquema  de lo contrario mandara error. 

### Datos con fecha de expiracion
```javascript 
 cache: {
    field: "requestedOn",
    seconds: 60
  }
```


Esta opción de cache es el createIndex en Mongodb __"datos con fecha de expiración"__ Para su uso se debe agregar un campo tipo  "__Date__ ejemplo  ver el schema anterior, en el collector se le pasaria a la propiedad  __cache__ el nombre del campo de tipo fecha   y los segundos 

```javascript 
plugdo.collector("mongoTest", {
  type: "db",
  action: "mongodb",
  server: {
     user: "",
    password: "",
    host: "localhost:27017",
    options: ""
  },
  db:"plugdoconnector",
  collection: "plugdo",
  queryType: "insert",
  validateExist:true,
   cache: {
    field: "requestedOn",
    seconds: 60
  }
  schema: schemaUser
})

```
En el ejemplo anterior se agrega la configuración directamente en el __collect__ 

Tambien puede colocar los segundos de manera dinamica al momento de mandar el modelo que desea guardar un ejemplo:

```javascript 
  var dataInsert = {
    "email": "abdielantonio.flores@gmail.com",
    "password": "65454694635468",
    "requestedOn": new Date(),
  }

  var cache = {
    seconds: 60
  }
```

se coloca la propiedad seconds Y se le envia  como segundo parametro al collect
Ejemplo:

```javascript
   plugdo.collect("mongoTest").get(dataInsert,cache, function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })

```
de las dos maneras es valido para el conector  


 ### Ejemplo para un select 

La configuracion del integrador o el web Api  no cambia, se arma el modelo  de datos que queremos consultar  Ejemplo:
 ```javascript 
  var dataSelect = { 
      email: "abdiel@plugdo.com",
  }
 ```
 se recomienda consultar por el dato que usteds coloco como __Unique__  

 La configuración del collector  es de solo agregar una propiedades nuevas ejemplo : 
 ```javascript 
plugdo.collector("mongoTest", {
  type: "db",
  action: "mongodb",
  server: {
     user: "",
    password: "",
    host: "localhost:27017",
    options: ""
  },
  db:"plugdoconnector",
  collection: "plugdo",
  queryType: "select",
  exclude:{password:0}
  schema: schemaUser
})

```
Se agrega una propiedad __exclude__ si queremos que al momento de la consulta ignore algunos campos 
ejemplo:
 ```javascript  
   exclude:{password:0}
```

siempres el valor sera __0__

__si no queremos que ignore campos dejar la propiedad vacia o no ponerla ya por defecto llegara vacia__



### Ejemplo de un update 
para actualizar la data es lo mismo se arma un modelo de la data que decea actualizar  Ejemplo:

__un collector su configuracion seria la siguiente__
```javascript 
plugdo.collector("mongoTest", {
  type: "db",
  action: "mongodb",
  server: {
     user: "",
    password: "",
    host: "localhost:27017",
    options: ""
  },
  db:"plugdoconnector",
  collection: "plugdo",
  queryType: "update",
  exclude:{password:0}
  schema: schemaUser
})

```

en  el envio  de la data seria  de la siguiente manera 
```javascript
 var find = {
    email: "abdielantonio.af@gmail.com"
  }

  var update = {
    "email": "aflores@digitalprimeint.com",
    "password": "123456",
    "requestedOn": new Date(),
  }
``` 


primero se manda el parametro de busqueda  por el campo unique ya definido y luego la data que quiere ingresar Ejemplo

```javascript 
  plugdo.collect("mongoTest").get(find,update,function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })
```

### Ejemplo de un delete 

para eliminar un dato seria de la misma manera  armamos un modelo ya sea   usando el api o integrador   Ejemplo:
```javascript
var deleteData = {
    email:"aflores@digitalprimeint.com"
  }
```

se elimina por el campo unique para evitar errores 

ejemplo de envio de data 


```javascript 
  plugdo.collect("mongoTest").get(deleteData,function (data, err) {
    if (err) {
      send({}, err)
    } else {
      response.result = data;
      send(response)
    }
  })
```

