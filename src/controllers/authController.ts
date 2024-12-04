import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { UserService } from "../services/userService";

class AuthController {
    private jwtSecret: string;
    private userService: UserService;

    constructor() {
        const config = dotenv.config().parsed || {};
        this.jwtSecret = config.JWT_SECRET || (() => { throw new Error('No jwt secret'); })();
        this.userService = new UserService();
    }

    public showRegisterPage = async (req: Request, res: Response) => {
        res.render('register', { response: null });
    };

    public handleRegister = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await this.userService.register(username, password);
            res.status(200).json({ code: 200, message: '注册成功' });
        } catch (error) {
            res.status(500).json({ code: 500, message: '注册失败', error });
        }
    };

    public showLoginPage = async (req: Request, res: Response) => {
        res.render('login', { response: null });
    };

    public handleLogin = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const user = await this.userService.login(username, password);
            if (user) {
                const token = jwt.sign({ id: user.id, username: user.username }, this.jwtSecret, { expiresIn: '12h' });
                // 设置 Cookie
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict', // 防止 CSRF 攻击
                    maxAge: 12 * 60 * 60 * 1000 // 12 小时（以毫秒为单位）
                });
                res.status(200).json({ code: 200, message: `登录成功，欢迎回来，${user.username}！` });
            } else {
                res.status(401).json({ code: 401, message: '登录失败' });
            }
        } catch (error) {
            res.json({ message: '登录失败', error });
        }
    };
}

export default new AuthController();