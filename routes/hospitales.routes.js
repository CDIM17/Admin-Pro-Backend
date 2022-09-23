/*
/api/hospitales
*/

const {Router} = require('express');
const {check}  = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const { getHospitales,crearHospital,actualizarHospital,eliminarHospital} = require('../controllers/hospitales.controller');

const router = Router();

router.get('/',[
    validarJWT
],getHospitales);

router.post('/', [
                    validarJWT,
                    check('nombre','El nombre del hospital es necesario').not().isEmpty(),
                    validarCampos
                ],
                crearHospital);

router.put('/:id',[
                    validarJWT,
                    check('nombre','El nombre del hospital es necesario').not().isEmpty(),
                    validarCampos
                  ],actualizarHospital);

router.delete('/:id',validarJWT,eliminarHospital);                


module.exports = router;