/**============================================================
 * PROYECTO - REST SERVER: PUERTO
=============================================================*/
process.env.PORT = process.env.PORT || 3000;

/**============================================================
 * ENTORNO
=============================================================*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**============================================================
 * BASE DE DATOS / CONEXION
=============================================================*/
let urlDB;

if(process.env.NODE_ENV === 'dev'){
  
  // ESTABLECER CONEXION LOCAL
  urlDB = 'mongodb://localhost:27017/cafe';

}else{
  
  // ESTABLECER CONEXION ATLAS
  /**process.env.MONGO_URI */
  urlDB = process.env.MONGO_URI;

}

// CREAR VARIABLE ENVIROMENT CON LA URL SEGUN EL ENTORNO
process.env.URLDB = urlDB;
// mongodb://localhost:27017/cafe
// mongodb+srv://developer:K0lW5IznFCR7HxA6@clusterpractice.oahzc.mongodb.net/cafe