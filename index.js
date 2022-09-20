require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

//Crear servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y Parse del Body
app.use(express.json());

//Base de Datos
dbConnection();


//Rutas
app.use('/api/usuarios',require('./routes/usuarios.routes'));
app.use('/api/login',require('./routes/auth.routes'));



app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en puerto ' + process.env.PORT);
});