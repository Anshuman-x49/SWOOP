import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    try {
        if (typeof config.mongodbUri !== 'string') {
            throw new Error('MongoDB URI is not configured');
        }
        await mongoose.connect(config.mongodbUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;