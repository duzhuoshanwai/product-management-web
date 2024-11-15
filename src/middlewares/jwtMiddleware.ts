import dotenv from "dotenv";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/User";
import { Request } from "express";

const config = dotenv.config().parsed;
const jwtSecret = config ? config.JWT_SECRET : (() => { throw new Error('No jwt secret'); })();

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
        console.log(token);
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: jwtSecret,
};

// 创建 JWT 策略
const jwtStrategy = new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await UserModel.findById(jwtPayload.id);
        console.log(user);
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

export { jwtStrategy as default };
