import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado' });
        return;
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secreto');
        req.user = decoded;
        next(); // Se asegura de continuar la ejecución
    } catch (error) {
        res.status(403).json({ mensaje: 'Token inválido o expirado' });
        return;
    }
};
