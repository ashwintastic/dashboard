import mongoose, { Schema } from '../mongoose';

const flowSchema = new Schema({
  id: String,
  botId: String,
  description: String,
  version: String,
  initialNode: String,
  persistentMenu: String,
  getStarted: String,
  greetingText: String,
  keywords: { type: Schema.Types.ObjectId },
  flow: { type: Schema.Types.ObjectId },
});

const Flow = mongoose.model('Flow', flowSchema);

export default Flow;
