const Usuario      = require('../models/usuario.model');
const {response}   = require('express');
const bcrypt       = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');


const getUsuarios = async (req,res) => {

    const desde = Number(req.query.desde) || 0;

   /*
    const usuarios = await Usuario
                                .find({},'nombre email role google')
                                .skip(desde)
                                .limit(5)

    const total = await Usuario.count(); */

   const [usuarios,total] =  await Promise.all([

        Usuario
        .find({},'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.count()
        
    ])                               

    res.json({
        ok:true,
        msg:'Get Usuarios',
        usuarios,
        uid:req.uid,
        total
    });

}


const crearUsuario = async(req,res = response) => {

   const {email,password} = req.body;

   try{

    const existeEmail = await Usuario.findOne({email});

    if(existeEmail)
    {
        return res.status(400).json({
            ok:false,
            msg:'El correo ya esta registrado'
        });
    }

    const usuario = new Usuario(req.body);

    //Encriptar Password
    const salt       = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    const nuevo_usuario = await usuario.save();

    //GENERAR JSON WEB TOKEN
    const token = await generarJWT(nuevo_usuario.id);

    res.json({
        ok:true,
        msg:'Crear Usuario',
        usuario,
        token
    });

   }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error Inesperado..revisar logs'
        });
   }

}

const actualizarUsuario = async(req,res = response) => {

    //TODO: VALIDAR TOKEN Y COMPROBAR SI ES EL USUARIO CORRECTO

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB)
        {
            return res.status(404).json({
                    ok:false,
                    msg:'No existe un usuario con ese ID'

            })
        }

        //Actualizaciones
        const {password,google,email,...campos} = req.body;

        if(usuarioDB.email !== email)
        {
            const existeEmail = await Usuario.findOne({email});

            if(existeEmail)
            {
                return res.status(400).json({
                        ok:false,
                        msg:'Ya Existe un usuario con ese email'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});

         res.json({
            ok:true,
            usuario: usuarioActualizado
         })
    }
    catch(error){

        console.log(error);

        res.status(500).json({
            ok:false,
            msg:'Error Inesperado'
        })

    }

}

const eliminarUsuario = async(req,res,next) => {

    const uid = req.params.id;

   try{

    const usuarioDB = Usuario.findById(uid);

    if(!usuarioDB)
    {
        res.status(404).json({
            ok:false,
            msg:'Usuario no Encontrado'
        })
    }

    await Usuario.findByIdAndDelete(uid);

    res.status(200).json({
        ok:true,
        msg:'Usuario Eliminado'
    })
   }
   catch(error)
   {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg:'Contact Tech Support!!'
        })
   }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}