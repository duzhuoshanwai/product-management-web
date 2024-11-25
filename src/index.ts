import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import { connectToMongoDB } from './models/db';
import productRouter from './routers/productRouter';
import authRouter from './routers/authRouter';
import path from 'path'; // 导入 path 模块
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import jwtStrategy from './middlewares/jwtMiddleware';
import { renderIndex } from './controllers/indexController';
import { createEnvFileIfNotExists } from './utils/createEnvFile';

createEnvFileIfNotExists();

const config = dotenv.config().parsed;

// 连接数据库
const mongoUri: string = config ? config.MONGO_URI : (() => { throw new Error('No mongo uri'); })();
const mongoClient = connectToMongoDB(mongoUri);

const app = express();
const PORT = parseInt(config.PORT) || 8000;
const HOST = config.HOST || '0.0.0.0';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));
// passport 初始化
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// 配置视图引擎和视图目录
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // 设置视图目录

// 静态文件服务
app.use(express.static(path.join(__dirname, './public')));


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  renderIndex(req, res, next);
});

app.use('/', authRouter);
app.use('/', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), productRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});