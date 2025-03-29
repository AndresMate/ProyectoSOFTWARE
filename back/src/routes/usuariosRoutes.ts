import { Router } from 'express';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../controllers/userController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = Router();

// Rutas protegidas con middleware de autenticación
router.get('/', verificarToken, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.post('/', verificarToken, crearUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

export default router;
