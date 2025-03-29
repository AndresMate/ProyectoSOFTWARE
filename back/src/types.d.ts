import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any; // O usa un tipo más específico si lo tienes
    }
}
