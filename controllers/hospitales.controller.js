const {response} = require('express');
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


const actualizarHospital = (req,res) => {

    res.json({
        ok:true,
        msg:'actualizarHospitales'
    })

}


const eliminarHospital = (req,res) => {

    res.json({
        ok:true,
        msg:'eliminarHospitales'
    })

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}