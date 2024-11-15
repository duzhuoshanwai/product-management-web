import express from 'express';
import AuthController from '../controllers/authController';

const authRouter = express.Router();

authRouter.get('/login', AuthController.showLoginPage);
authRouter.post('/login', AuthController.handleLogin);
authRouter.get('/register',AuthController.showRegisterPage);
authRouter.post('/register', AuthController.handleRegister);

export default authRouter;