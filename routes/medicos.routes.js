/*
/api/hospitales
*/
const {Router} = require('express');
const {check}  = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const {getMedicos,crearMedico,actualizarMedico,eliminarMedico,getMedicoById} = require('../controllers/medicos.controller');

const router = Router();

router.get('/',[validarJWT],getMedicos);

router.get('/:id',validarJWT,getMedicoById);                


router.post('/', [
                    validarJWT,
                    check('nombre','El nombre del medico es necesario').not().isEmpty(),
                    check('hospital','El ID del Hospital debe ser valido').isMongoId(),
                    validarCampos
                 ],crearMedico);

router.put('/:id',
                  [
                     validarJWT,
                     check('nombre','El nombre del medico es necesario').not().isEmpty(),
                     check('hospital','El ID del Hospital debe ser valido').isMongoId(),
                     validarCampos
                  ],actualizarMedico);

router.delete('/:id',validarJWT,eliminarMedico);                


module.exports = router;