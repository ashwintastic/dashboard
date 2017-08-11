import mongoose, { Schema } from '../mongoose';


const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  emailConfirmed: { type: Boolean, default: false },
  auth: {
    local: {
      password: { type: String },
    },
    facebook: {
      key: { type: String },
      accessToken: { type: String },
    },
  },
  roles: [{ type: String, enum: ['SuperAdmin', 'BotworxAdmin', 'AccountAdmin','BotOwner', 'BotEditor', 'BotTester'] }],
  accounts: [{ type: String }],
  bots: [{ type: String }],
  userAccessToken: { type: String },
});

const User = mongoose.model('DashboardUser', userSchema);

export default User;
