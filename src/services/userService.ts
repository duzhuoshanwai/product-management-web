import { UserInterface, UserModel } from "../models/User";
import bcrypt from 'bcrypt';

export class UserService {
    public async register(username: string, password: string): Promise<UserInterface> {

        // 生成盐和密码哈希
        const saltRounds = 10;
        // bcrypt.hash 方法会自动生成盐值并将其包含在生成的哈希中。
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 创建用户实例并保存
        const user = new UserModel({ username, password_hash });
        await user.save();

        return user;
    }

    

    public async login(username: string, password: string): Promise<UserInterface | null> {

        // 查找用户
        const user = await UserModel.findOne({ username });
        if (!user) {
            return null;
        }

        // 验证密码哈希
        // bcrypt.compare 方法会自动从哈希中提取盐值并使用它来验证密码。
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return null;
        }

        return user;
    }
}