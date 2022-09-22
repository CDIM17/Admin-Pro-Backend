const {response} = require('express');
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const getTodo = async (req,res = response) => {

    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda,'i');

    const [usuarios,hospitales,medicos] = await Promise.all([

        Usuario.find({nombre:regex}),
        Hospital.find({nombre:regex}),
        Medico.find({nombre:regex})
        
    ])

    res.json({
        ok:true,
        msg:'getTodo',
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async (req,res = response) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp(busqueda,'i');

    let data = [];

    switch(tabla)
    {
        case 'medicos':
            data = await Medico.find({nombre:regex})
                                                    .populate('usuario','nombre img')
                                                    .populate('hospital','nombre img');
            break;
        
        case 'hospitales':
            data = await Hospital.find({nombre:regex}).populate('usuario','nombre img');
            break;    

        case 'usuarios':
            data = await Usuario.find({nombre:regex});
            break;    

        default:
            return res.status(400).json({
                ok:false,
                msg:'Coleccion No Encontrada'
            })
            break;    
    }

    res.json({
        ok:true,
        data
    })
}


module.exports = {
    getTodo,
    getDocumentosColeccion
}