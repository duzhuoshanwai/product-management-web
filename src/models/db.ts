import mongoose from 'mongoose';
import dotenv from 'dotenv';

const config = dotenv.config().parsed;
const mongoUri :String= config ? config.MONGO_URI : (() => { throw new Error('No mongo uri'); })();

export async function connectToMongoDB(mongoUri: string) {
    try {
        const mongoClient = await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Atlas');
        return mongoClient.connection;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        return new Error('Connection to MongoDB Atlas failed');
    }
}