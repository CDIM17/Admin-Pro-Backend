const Usuario = require('../models/usuario.model');

const validarRole = async(req,res,next) => {

    try{

        const UsuarioDB = await Usuario.findById(req.uid);

        if(!UsuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'Usuario No Encontrado'
            })
        }

        if(UsuarioDB.role !== 'ADMIN_ROLE')
        {
            return res.status(403).json({
                ok:false,
                msg:"No tienes permisos"
            })
        }
        

        next();
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

const validarRole_o_mismoUsuario = async(req,res,next) => {

    try{

        const UsuarioDB = await Usuario.findById(req.uid);

        if(!UsuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'Usuario No Encontrado'
            })
        }

       
        if(UsuarioDB.role === 'ADMIN_ROLE' || req.uid === req.params.id)
        {
           next();
        }
        else
        {
            return res.status(403).json({
                ok:false,
                msg:"No tienes permisos"
            })
        }
        
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
    validarRole,
    validarRole_o_mismoUsuario
}