//Aqui se extrae un funcion de express
const { Router } = require('express');
const {check} = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//Es enviar
//Aqui se validan los campos que vamos a recibir
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

module.exports = router;