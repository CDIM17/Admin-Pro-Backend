const {response} = require('express');
const Medico     = require('../models/medico.model');


const getMedicos = async (req,res) => {

    const medicos = await Medico.find()
    .populate('usuario','nombre email img')
    .populate('hospital','nombre img');

    res.json({
        ok:true,
        medicos
    })

}

const crearMedico = async (req,res = response) => {

    try
    {
        const uid = req.uid;

        const medico = new Medico({
            usuario:uid,
            ...req.body
        });

        if(!req.body.hospital)
        {
            return res.status(400).json({
                ok:false,
                msg:'El Hospital es requerido'
            })
        }

        const medicoDB = await medico.save();

        console.log(uid);

        res.json({
            ok:true,
            medico:medicoDB
        })
    }
    catch(error)
    {
        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg:'Contact Tech Support'
        });
    }
}


const actualizarMedico = (req,res) => {

    res.json({
        ok:true,
        msg:'actualizarMedico'
    })

}


const eliminarMedico = (req,res) => {

    res.json({
        ok:true,
        msg:'eliminarMedico'
    })

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}