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
            res.status(200).send(`<script>alert("注册成功，${user.username}！"); window.location.href = '/login';</script>`);
        } catch (error) {
            res.status(500).json({ message: '注册失败', error });
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
                res.cookie('jwt', token, { httpOnly: true, secure: false });
                res.status(200).send(`<script>alert("登录成功，欢迎回来，${user.username}！"); window.location.href = '/products';</script>`);
            } else {
                res.status(401).send('<script>alert("登录失败");window.location.href = "/login";</script>');
            }
        } catch (error) {
            res.json({ message: '登录失败', error });
        }
    };
}

export default new AuthController();