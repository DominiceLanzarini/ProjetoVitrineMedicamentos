import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const secretKey = "ehuhAHEUhsujkjasjeE"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
            if (err || !decoded) {
                res.status(401).json(err).end()
            } else {
                // @ts-ignore
                req.params.userId = decoded.data.id
                next();
            }
        })
    } else {
        res.status(401).send('Acesso negado.');
    }
}
