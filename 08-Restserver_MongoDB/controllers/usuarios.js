//Esta linea me ayuda a conectar el controlador con las rutas ya que sino no podria 
//realizar el res de manera por default por lo que se iguala
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');



//Aqui lo que se maneja es la url en parametros
const usuariosGet = async (req = request, res = response ) => {
    // const query = req.query;
    const { limite=5, desde = 0 } = req.query;
    const query = { estado: true};

    //Estamos creando un promesa para que los 2 se ejeuten al mismo tiempo y reduscan el tiempo
    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
          .skip( Number( desde ))
          .limit( Number( limite ))
    ]);

    res.json({
        total,
        usuarios
});
  }


const usuariosPost = async (req, res = response ) => {
    //Podemos utilizar el objeto completo o destructuralizarlo que tiene esto es bueno cuando nos envian algun id
    // const body = req.body;
    //---------const body = req.body;
    //Estos son los campos que voy a grabar en la creacion de un usuario 
    //Aqui se desectructura el body para pedir los campos que quiiero
    const { nombre, correo, password, rol } = req.body;
    //Aqui se usa una instancia para que el modelo y se otorga el valor que valla en el body, todos los argumentos se los envia a mi modelo
    // const usuario = new Usuario( body );
    //Como se desectructuro el body haremos lo mismo
    const usuario = new Usuario({ nombre, correo, password, rol });

    

    //ENCRIPTAR LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);
    //AQUI SE GRABA EL REGISTRO
    await usuario.save();
    res.json({
        //body
        usuario
    });
  }


const usuariosPut = async (req, res = response ) => {
    //Aquiva el enrutador del id
    const {id} = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
       //Encriptar la contraseña 
       const salt = bcryptjs.genSaltSync();
       resto.password = bcryptjs.hashSync(password, salt);
    }
    //Aqui actualiza toda la información , buscando a traves del id, Ya actualizado lo almacena en usuario
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
  }


//Coloque el async porque hay interacción con la base de datos
const usuariosDelete = async  (req, res = response ) => {
    //Destructuramos de donde viene el id
    const { id } = req.params;
    
    //Fisicamente lo borramos
    // const usuario = await Usuario.findOneAndDelete( id );
    //Esta nos ayuda ya que se elimina desde mi backend pero queda en mi base de datos
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    

    res.json(usuario );
  }

const usuariosPatch = (req, res = response ) => {
    res.json({
        msg: 'patch API- controlador'
    });
  }

  module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
  }