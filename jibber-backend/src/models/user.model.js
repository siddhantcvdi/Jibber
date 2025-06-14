import mongoose from 'mongoose';
const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  registrationRecord: { type: String, required: true },
  encPrivateIdKey: { type: String, required: true, unique: true },
  encPrivateSigningKey: { type: String, required: true, unique: true },
  publicIdKey: { type: String, required: true, unique: true },
  publicSigningKey: { type: String, required: true, unique: true },
    resetCode: {
    code: String,
    expiresAt: Date,
  },
});

export default mongoose.model('User', User);
