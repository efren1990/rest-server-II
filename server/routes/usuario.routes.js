/**==============================================
* IMPORTAR MODULOS
=================================================*/
const express = require('express');

/**==============================================
* IMPORTAR BCRYPT - ENCRIPTAMIENTO
=================================================*/
const bcrypt = require('bcrypt');
/**bcrypt.hashSync(valorEncriptar, NumeroDeVueltas) */

/**==============================================
* IMPORTAR UNDERSCORE 
=================================================*/
// npm i underscore - https://underscorejs.org
const _u = require('underscore');

/**==============================================
* IMPORTAR MODELO DE DATOS: USUARIO
=================================================*/
const Usuario = require('../models/usuario.model');

/**===================================================
* INSTANCIA EXPRESS
=====================================================*/
const app = express();


/**====================================================
* SISTEMA DE RUTAS USUARIO
=====================================================*/

// GET: ****USUARIO ***********************************>
app.get('/usuario', (req, res) => {
  
  // TOMAR PARAMETROS OPCIONALES
  /**http://laruta/usuario?nombreParam=valor */
  
  /**Si el parametro no viene toma el valor de 0 */
  let desde = req.query.desde || 0;
  // Cast a numero
  desde = Number(desde);

  let limite = req.query.limite || 0;
  // Cast a numero
  limite = Number(limite);

  // PETCION PARA TRAER LISTADO DE DATOS
  /**Esquema.find({nombreCampoBusqueda:busqueda}, 'camposMostrar1 mostrar2 mostrar3').exec((error, listado) => {}) 
   * limit(numero) -> limita la cantidad de registros devuelto
   * skip(numero) -> salta/inicia desde el numero indicado
  */
  // Retorna los usuarios cuyo estado este en true
  Usuario.find({estado:true}, 'nombre email roles estado')
         .skip(desde)
         .limit(limite)
         .exec((err, usuarios) => {
           if(err){
             return res.status(400).json({
               ok: false,
               error: err
             })
           }
          //  CONTEO DE REGISTROS DE LA BASE DE LA COLECCION
          Usuario.count({estado:true}, (err, count) => {
            res.json({
              ok: true,
              conteo: count,
              total:usuarios.length,
              usuarios
            })
          })
         })
  // RESPUESTA
});

// POST: ****USUARIO **********************************>
app.post('/usuario', (req, res) => {

  // TOMAR EL BODY DE LA PETICION - PAYLOAD
  let body = req.body;
  
  /**INSTANCIA DE ESQUEMA PARA CREAR EL USUARIO */
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    roles: body.role
  });
  
  // GUARDAR EL USUARIO,
  usuario.save((err, usuarioGuardado) => {
    // SI OCURRE UN ERROR
    if(err){
      // retorno de respuesta
      return res.status(400).json({
        ok: false,
        // err
        error: err.message
      });
    }
    // SI NO OCURRER ERROR

    // RETORNAR USUARIO GUARDADO
    res.json({
      ok: true,
      usuario: usuarioGuardado
    })
  });

});

// PUT: ****USUARIO ************************************>
app.put('/usuario/:id', (req, res) => {
  // TOMAR PARAMETROS DESPUES DE LA RUTA, LLEVAN LOS /:nombre
  let id = req.params.id;
  // TOMAR EL BODY / DATOS PARA ACTUALIZAR
  /**_u.pick(objeto, [propiedades]) permite obtener
   * solo las propiedades indicadas, esto para evitar
   * dejar actualizar campos deseados
   */
  let body = _u.pick(req.body, ['nombre', 'email', 'img', 'roles', 'estado']);

  // BUSCAR EL USUARIO POR ID Y ACTUALIZARLO
  /**
   * Esquema.findByIdAndUpdate(id, body,{new: true}, (errorSiExiste, usuarioDevueltoDB)
   * new: true -> Retorna objeno actualizado de la base de datos, no el objeto anterior
   * runValidators=true -> Corre nuevamente las validaciones, sobre todo la de user rol
   */
  Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB) => {
    // SI OCURRE UN ERROR
    if(err){
      // retorno de respuesta
      return res.status(400).json({
        ok: false,
        // err
        error: err
      });
    }
    // SI NO OCURRE ERROR
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  });

})

// DELETE: ****USUARIO *********************************>
app.delete('/usuario/:id', (req, res) => {
  
  // OBTENER ID A ELIMINAR/
  let id = req.params.id;
  // OBTENER EL TIPO DE ELEMINACION
  let typeDel = req.query.tipo || "delete"
  if(typeDel === "mark"){
    // DATOS ACTUALIZAR
    let data = {
      estado: false
    }
    // MARCAR EL REGISTRO COMO ELIMINADO
    Usuario.findByIdAndUpdate(id, data, {new:true}, (err, userUpdate) => {
      // SI OCURRE UN ERROR
      if(err){
        // retorno de respuesta
        return res.status(400).json({
          ok: false,
          // err
          error: err
        });
      }
      // SI NO EXISTE EL USUARIO
      if(!userUpdate){
        return res.status(400).json({
          ok: false,
          error: "Usuario no econtrado"
        })
      }
      // SI NO OCURRE ERROR
      res.json({
        ok: true,
        userUpdate
      })
    })
  }else{
    // ELIMINAR FISICAMENTE EL REGISTRO
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
      // SI OCURRE UN ERROR
      if(err){
        // retorno de respuesta
        return res.status(400).json({
          ok: false,
          // err
          error: err
        });
      }
      // VALIDAR SI EL USUARIO A BORAR NO EXISTE
      if(!usuarioBorrado){
        return res.status(400).json({
          ok: false,
          error:{
            message:'Usuario no Encontrado'
          }
        })
      }
      // SI NO OCURRE ERROR
      res.json({
        ok:true,
        usuario: usuarioBorrado
      });
      
    })
  }
});

// PATCH: ****USUARIO **********************************>
app.patch('/usuario', (req, res) => {
  // RESPUESTA
  res.json("PATCH USUARIO 3:}> ");
});

/**====================================================
* EXPORTAR MODULO
=====================================================*/
module.exports = app;