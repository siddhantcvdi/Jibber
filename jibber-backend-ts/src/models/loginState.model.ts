import mongoose, { Schema, Document, Model } from 'mongoose';


export interface ILoginState extends Document {
  username: string;
  email: string;
  serverLoginState: string;
  createdAt: Date; // Auto-managed, expires after 30s
}


export interface LoginStateModel extends Model<ILoginState> {
}


const loginStateSchema = new Schema<ILoginState, LoginStateModel>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    serverLoginState: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30, // Document expires 30 seconds after creation
    },
  },
);

export const LoginState = mongoose.model<ILoginState, LoginStateModel>(
  'LoginState',
  loginStateSchema
);
