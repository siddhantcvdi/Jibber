import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
  username: string;
  email: string;
  registrationRecord: string;
  encPrivateIdKey: string;
  encPrivateSigningKey: string;
  publicIdKey: string;
  publicSigningKey: string;
  idKeyNonce: string;
  idKeySalt: string;
  signingKeyNonce: string;
  signingKeySalt: string;
  profilePhoto?: string;
  resetCode?: {
    code?: string;
    expiresAt?: Date;
  };
  refreshTokenHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser, Model<IUser>>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    registrationRecord: { type: String, required: true },
    encPrivateIdKey: { type: String, required: true, unique: true },
    encPrivateSigningKey: { type: String, required: true, unique: true },
    publicIdKey: { type: String, required: true, unique: true },
    publicSigningKey: { type: String, required: true, unique: true },
    idKeyNonce: { type: String, required: true },
    idKeySalt: { type: String, required: true },
    signingKeyNonce: { type: String, required: true },
    signingKeySalt: { type: String, required: true },
    profilePhoto: { type: String, required: false, default: '' },
    resetCode: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    refreshTokenHash: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser, Model<IUser>>('User', userSchema);
