import mongoose from 'mongoose'
const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    registrationRecord: { type: String, required: true },
    resetCode: {
        code: String,
        expiresAt: Date,
    },
})

export default mongoose.model('User', User)