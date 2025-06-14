import mongoose from 'mongoose';

const loginStateSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  serverLoginState: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 15 },
});

export const LoginState = mongoose.model('LoginState', loginStateSchema);
