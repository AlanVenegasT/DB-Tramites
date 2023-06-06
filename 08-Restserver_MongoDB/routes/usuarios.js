//Aqui se extrae un funcion de express
const { Router } = require('express');
const {check} = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const { esRoleValido } = require('../helpers/db-validators');
const { emailExiste } = require('../helpers/db-validators');
const { existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');


//Aqui llamamos a la funcion que estamos extrayendo de express
const router = Router();

//Get es recuperar
router.get('/', usuariosGet  );

//Es enviar
//Aqui se validan los campos que vamos a recibir
router.post('/',[
        //Check es un middlerware que va a revisar el correo
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password','El password debe de ser más de 6 letras').isLength({ min: 6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        //hara una verificacion personalizada por eso el custom va a recibir com argumento el valor del body
        //Se le establece un rol vacio en cado de que no venga
        check('rol').custom(  esRoleValido ),
        validarCampos
], usuariosPost );

//Actualizar
router.put('/:id',[
        //Este middelaware ayuda a validar el id en la base de datos de Mongo
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom(  esRoleValido ),

        validarCampos
],usuariosPut );

//Elimina
router.delete('/:id',[
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE', 'USER_ROLE'),
        check('id','No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDelete );

//es muy similar al método PUT porque también modifica un recurso existente.
router.patch('/', usuariosPatch );


module.exports = router;