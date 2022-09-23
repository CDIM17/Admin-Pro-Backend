const {response} = require('express');
const hospitalModel = require('../models/hospital.model');
const Hospital = require('../models/hospital.model');

const getHospitales = async (req,res) => {

    const hospitales = await Hospital.find().populate('usuario','nombre email img');

    return res.json({
        ok:true,
        hospitales
    })

}

const crearHospital = async (req,res) => {

    const uid = req.uid;

    const hospital = new Hospital({
        usuario:uid,
        ...req.body
    });

    console.log(uid);

    try{

        const hospitalDB = await hospital.save();

        res.json({
            ok:true,
            hospital:hospitalDB
        })
    }
    catch(error){

        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg:'Hable con el Administrador'
        })
    }

   

}


const actualizarHospital = async (req,res = response) => {

    const hospitalId = req.params.id;

    try
    {
        const hospital = await Hospital.findById(hospitalId);

        if(!hospital)
        {
            res.status(404).json({
                ok:true,
                msg:'Hospital No Encontrado por ID'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario:req.uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId,cambiosHospital,{new:true});

        res.json({
            ok:true,
            hospital:hospitalActualizado
        })
    }  
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Contact Tech Support!'
        })
    }

}


const eliminarHospital = async (req,res) => {

    const id  = req.params.id;
    const uid = req.uid;

    try
    {
        const hospital = await Hospital.findById(id);

        if(!hospital)
        {
            res.status(404).json({
                ok:true,
                msg:'Hospital No Encontrado por ID'
            })
        }
        
        const hospitalEliminado = await Hospital.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:'Hospital Eliminado',
            hospitalEliminado
        })
    }  
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Contact Tech Support!'
        })
    }

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}