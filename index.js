require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

//Crear servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Carpeta Publica
app.use(express.static('public'));

//Lectura y Parse del Body
app.use(express.json());


//Base de Datos
dbConnection();


//Rutas
app.use('/api/usuarios',require('./routes/usuarios.routes'));
app.use('/api/hospitales',require('./routes/hospitales.routes'));
app.use('/api/medicos',require('./routes/medicos.routes'));
app.use('/api/login',require('./routes/auth.routes'));
app.use('/api/todo',require('./routes/busquedas.routes'));
app.use('/api/upload',require('./routes/uploads.routes'));

//Lo Ultimo
app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'public/index.html'));
})


app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en puerto ' + process.env.PORT);
});