import mongoose from 'mongoose';
const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  registrationRecord: { type: String, required: true },
  encPrivateIdKey: { type: String, required: true, unique: true },
  encPrivateSigningKey: { type: String, required: true, unique: true },
  publicIdKey: { type: String, required: true, unique: true },
  publicSigningKey: { type: String, required: true, unique: true },
  idKeyNonce: { type: String, required: true},
  idKeySalt: { type: String, required: true},
  signingKeyNonce: { type: String, required: true},
  signingKeySalt: { type: String, required: true},
  resetCode: {
    code: String,
    expiresAt: Date,
  },
});

export default mongoose.model('User', User);
