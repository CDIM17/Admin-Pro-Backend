const {response} = require('express');
const Medico     = require('../models/medico.model');
const Hospital   = require('../models/hospital.model');

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


const actualizarMedico = async (req,res) => {

    const id  = req.params.id;
    const uid = req.uid;

    try
    {
        const medicoDB = await Medico.findById(id);

        if(!medicoDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'Medico No Encontrado'
            })
        }

        const hospitalDB = await Hospital.findById(req.body.hospital);

        if(!hospitalDB)
        {
            return res.status(400).json({
                ok:false,
                msg:'Hospital No Encontrado'
            })
        }

        medicoDB.nombre   = req.body.nombre;
        medicoDB.hospital = req.body.hospital;
        medicoDB.usuario  = uid;

        const medicoActualizado = await medicoDB.save();

        res.json({
            ok:true,
            medicoActualizado
        })
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            ok:true,
            msg:'Contact Tech Support'
        })
    }

}


const eliminarMedico = async (req,res) => {

    const id  = req.params.id;
    const uid = req.uid;

    try
    {
        const medicoDB = await Medico.findById(id);

        if(!medicoDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'Medico No Encontrado'
            })
        }

        const medicoEliminado = await Medico.findByIdAndDelete(id);

        res.json({
            ok:true,
            medicoEliminado
        })
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            ok:true,
            msg:'Contact Tech Support'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}