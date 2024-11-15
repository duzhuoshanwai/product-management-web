import { Request, Response } from 'express';
import jsonwebtoken, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';

const config = dotenv.config().parsed;
const jwtSecret = config ? config.JWT_SECRET : (() => { throw new Error('No jwt secret'); })();


export const renderIndex = (req: Request, res: Response, next: Function) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.render('index', { code: 0,message: '请先登录' });
    }

    try {
        const decoded = jsonwebtoken.verify(token, jwtSecret);
        if (typeof decoded !== 'string' && decoded && decoded.username) {
            return res.render('index', { code:1,message: `欢迎回来, ${decoded.username}` });
        }
    } catch (err) {
        return res.status(401).send('Invalid token');
    }
};