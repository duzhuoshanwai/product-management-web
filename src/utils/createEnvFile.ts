import fs from 'fs';
import path from 'path';

export function createEnvFileIfNotExists(): void {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 'MONGO_URI=\nPORT=8000\nHOST=0.0.0.0\nJWT_SECRET=From the river to the sea\n');
    console.log('.env 文件已创建，请填写必要的环境变量。');
  }
};