const {response}           = require('express');
const { v4: uuidv4 }       = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const path = require('path');

const fs = require('fs');

const retornaImagen = (req,res = response) => {

    const tipo = req.params.tipo;
    const foto   = req.params.foto;

    const pathImg = path.join(__dirname,`../storage/${tipo}/${foto}`);

    //Imagen por Defecto
    if(fs.existsSync(pathImg))
    {
        res.sendFile(pathImg);
    }
    else
    {
        const pathImg = path.join(__dirname,`../storage/no-img.jpeg`);
        res.sendFile(pathImg);
    }
}

const fileUpload = (req,res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    //Validar Tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];

    if(!tiposValidos.includes(tipo))
    {
        return res.status(400).json({
            ok:false,
            msg:'No es un recurso valido'
        })
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No files were uploaded'
        });
      }

    //Procesar la Imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Validar Extension
    const extensionesValidas = ['png','jpeg','jpg'];

    if(!extensionesValidas.includes(extensionArchivo))
    {
        return res.status(400).json({
            ok:false,
            msg:'No es una extension valida'
        })
    }

    //Generar Nombre del Archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

    //Path para guardar la imagen
    const path = `./storage/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err)
        {
            return res.status(500).json({
                ok:false,
                err
            });
        }
    });

    //Actualizar Base de Datos
    actualizarImagen(tipo,id,nombreArchivo);

    res.json({
        ok:true,
        msg:'File Uploaded',
        nombreArchivo
    })
}


module.exports = {
    fileUpload,
    retornaImagen
}
