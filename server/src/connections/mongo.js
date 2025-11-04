import mongoose from 'mongoose';
import config from '../config/index.js';

const connectMongo = () => mongoose.connect(config.MONGO_URI);

export default connectMongo;
