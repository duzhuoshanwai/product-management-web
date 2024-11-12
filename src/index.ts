import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {connectToMongoDB} from './models/db';
import productRouter from './routers/productRouter';
import path from 'path'; // 导入 path 模块

const config = dotenv.config().parsed;

// 连接数据库
const mongoUri :string= config ? config.MONGO_URI : (() => { throw new Error('No mongo uri'); })();
const mongoClient = connectToMongoDB(mongoUri);

const app = express();
const port = config.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置视图引擎和视图目录
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // 设置视图目录

// 静态文件服务
app.use(express.static(path.join(__dirname, './public')));


app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.post('/', (req: Request, res: Response) => {
  res.json(req.body);
});


app.use('/',productRouter)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});