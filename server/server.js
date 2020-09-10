/**============================================================
 * PROYECTO - REST SERVER:
=============================================================*/
/**==============================================
* IMPORTAR MODULOS
=================================================*/
// ARCHIVO DE CONFIGURACIONES GLOBALES->
require('./config/config');
// EXPRESS->
const express = require('express');
// MONGOOSE -> MODULO PARA IMPLEMENTAR MONGO DB
const mongoose = require('mongoose');

/**==============================================
* INSTANCIA EXPRESS - CONFIGS
=================================================*/
// BODY PARSER - permite obtener los payload para las peticiones POST
const bodyParser = require('body-parser');
// INSTANCIA EXPRESS->
const app = express();
// MIDDLEWARE: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// MIDLEWARE: parse application/json
app.use(bodyParser.json())

/**==============================================
* IMPORTAR MODULO DE RUTAS: USUARIO
=================================================*/
app.use(require('./routes/usuario.routes'));

/**==============================================
* CONEXION BASE DE DATOS MONGOOSE
=================================================*/
// Base de de datos puerto
const db_port = 27017;
// Base de datos
const db_name = 'cafe'
// mongoose.connect(`mongodb://localhost:${db_port}/${db_name}`, {
mongoose.connect(process.env.URLDB, {
  // OBLIGATORIO 
  useNewUrlParser: true,
  // OBLIGATORIO
  useUnifiedTopology: true,
  // OBLIGATORIO
  useCreateIndex: true
}, (err, res) => {
  
  // EMITIR ERROR - SI NO CONECTA CON LA DB
  if( err ) throw err;

  // SI NO OCURRE ERROR, MENSAJE
  console.log('db - On')

});

/**==============================================
* SALIDA DE PUERTO
=================================================*/
app.listen(process.env.PORT, () => {
  console.log(`On PORT: ${process.env.PORT}`);
})


