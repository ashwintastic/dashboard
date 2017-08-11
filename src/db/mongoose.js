import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { db } from '../config';

mongoose.Promise = bluebird;
mongoose.connect(db.url, { config: db.config });

const Schema = mongoose.Schema;

export { Schema };
export default mongoose;
