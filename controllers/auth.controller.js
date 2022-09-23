const {response}   = require('express');
const Usuario      = require('../models/usuario.model');
const bcrypt       = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req,res) => {

    const {email,password} = req.body;

    try{

        const usuarioDB = await Usuario.findOne({email});

        //Verificar Email
        if(!usuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'Email no Encontrado'
            })
        }

        //Verificar Password
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);

        if(!validPassword)
        {
            return res.status(400).json({
                ok:false,
                msg:'Password no Valido'
            })
        }

        //Generar el Token
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({

            ok:true,
            msg:'Login',
            token

        });

    }catch(error){
        console.log(error);

        res.status(500).json({

            ok:false,
            msg:'Contact Tech Support'

        });
    }

}

const googleSignIn = async(req,res = response) => {

    try{
        const googleUser = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email:googleUser.email});
        let usuario;

        if(!usuarioDB)
        {
            usuario = new Usuario({
                nombre:googleUser.name,
                email:googleUser.email,
                password:'@@@',
                img:googleUser.picture,
                google:true
            });
        }
        else
        {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar Usuario
        await usuario.save();

        //Generar Token
        const token = await generarJWT(usuario.id);


        res.json({
            ok:true,
            googleUser,
            name: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            token
        })
    }
    catch(error)
    {
        console.log(error);

        return res.status(400).json({
            ok:true,
            msg:'Token de Google no es correcto'
        })
    }

}

module.exports = {
    login,
    googleSignIn
};