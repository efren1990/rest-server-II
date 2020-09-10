/**=========================================================
* MODELO DE DATOS
==========================================================*/
// MODULO MONGOOSE
const mongoose = require('mongoose');
// MODULO MONGOOS UNIQUE VALIDATOR / VALIDADOR DE COMAPOS UNICOS
const uniqueValidator = require('mongoose-unique-validator')

// OBJETO PARA ROLES VALIDOS
let rolesValidos = {
  values:['ADMIN_ROLE', 'USER_ROLE'],
  message:'{VALUE} no es un rol valido'
}; 

// CASCARON PARA EL ESQUEMA
let Schema = mongoose.Schema;

/**=============================================
* CREAR ESQUEMA DE USUARIO
===============================================*/
/** cada esquema tiene que ser configurado
 * reglas y controles, campos
*/
/**Para validator unique instalar:
 * npm install mongoose-unique-validator --save
 */
let usuarioSchema = new Schema({
  nombre:{
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email:{
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password:{
    type: String,
    required: [true, 'La contraseña es Obligatoria']
  },
  img:{
    type: String,
    required: false
  },
  roles:{
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado:{
    type: Boolean,
    default: true
  },
  google:{
    type: Boolean,
    default: false
  }
});
/**=============================================
* QUITAR EL PASSWORD DEL ESQUEMA EN RESPUESTAS
===============================================*/
usuarioSchema.methods.toJSON = function(){
  // TOMAR EL OBJETO
  let user = this;
  let userObject = user.toObject();
  // BORRAR EL CAMPO ESPECIFICO DEL OBJETO
  delete userObject.password;
  // RETORNAR OBJETO SIN CAMPO
  return userObject;
}

// CARGAR EL PLUGIN DEL CAMPO UNICO AL ESQUEMA
usuarioSchema.plugin(uniqueValidator, {
  message: 'El {PATH} debe de ser único'
})
// EXPORTAR EL MODELO DE DATOS
/**mongoose.model('NombreModelo', objetoModelo) */
module.exports = mongoose.model('Usuario', usuarioSchema);