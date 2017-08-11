import mongoose, { Schema } from '../mongoose';

const botSchema = new Schema({
  name: { type: String },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  botId: { type: String },
});

const Bot = mongoose.model('Bot', botSchema);

export default Bot;
