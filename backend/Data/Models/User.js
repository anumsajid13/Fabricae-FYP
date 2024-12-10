const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["IndustryProfessional", "Designer"],
        default: "viewer" 
    },
    profilePictureUrl: { type: String }, 
    country: { type: String },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
});

UserSchema.pre('save', async function (next) {

    this.updatedAt = Date.now();
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model using CommonJS
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
