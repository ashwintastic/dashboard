import mongoose, { Schema } from '../mongoose';

const accountSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  adminEmail: { type: String },
  manager: { type: Schema.Types.ObjectId, ref: 'User' },
  managerEmail: { type: String },
  name: String,
  dashboarduser: String,
  bots: [{ type: String }],
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
