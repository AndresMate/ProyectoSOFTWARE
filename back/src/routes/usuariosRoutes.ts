import { Router } from 'express';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil
} from '../controllers/userController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = Router();

// Ruta para obtener el perfil del usuario autenticado
router.get('/perfil', verificarToken, obtenerPerfil);

// Otras rutas protegidas
router.get('/', verificarToken, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.post('/', verificarToken, crearUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

export default router;
