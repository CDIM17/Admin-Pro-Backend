require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

//Crear servidor de express
const app = express();

//Configurar CORS
app.use(cors());


//Base de Datos
dbConnection();


//Rutas
app.get('/', (req,res) => {

    res.json({
        ok:true,
        msg:'Hola Mundo'
    });

});


app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en puerto ' + process.env.PORT);
});