import mongoose from 'mongoose';
import { CONNECTION_STRING } from './global';

mongoose.Promise = global.Promise;

mongoose
	.connect(CONNECTION_STRING)
	.then(() => console.log('mongoose success'), err => console.log(err));

export default mongoose;
