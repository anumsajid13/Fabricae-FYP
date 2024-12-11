const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fashionBrandDomains = [
    'sapphireonline.com', // Sapphire
    'khaadi.com',         // Khaadi
    'bonanzaonline.com',  // Bonanza Satrangi
    'gulahmedshop.com',   // Gul Ahmed
    'junaidjamshed.com',  // Junaid Jamshed (J. Studio)
    'bareeze.com',        // Bareeze
    'ansabjahangir.com',  // Ansab Jahangir
    'zara.com',           // Zara (Global brand with a Pakistani presence)
    'pretwear.com',       // Pret Wear
    'pashmina.com.pk',    // Pashmina
    'ethnic.pk',          // Ethnic by Outfitters
    'outfitters.com.pk',  // Outfitters
    'seherra.com',        // Seherra
    'hassanfarooq.com',   // Hassan Farooq
    'maheenkarim.com',    // Maheen Karim
    'tarzz.com.pk',       // Tarzz
    'levispakistan.com',  // Levi's Pakistan
    'chinyere.com',       // Chinyere
    'nishatlinen.com',    // Nishat Linen
    'lulus.com.pk',       // Lulus (Pakistani brand)
    'ayesha-somaya.com',  // Ayesha Somaya
    'firdous.com.pk',     // Firdous
];

const UserSchema = new mongoose.Schema({
    firstname: { type: String},
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String},
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

// Add email domain check before saving the user
UserSchema.pre('save', async function (next) {
    // Extract domain from email
    const emailDomain = this.email.split('@')[1];
    
    // Log the extracted email domain
    console.log('Extracted Email Domain:', emailDomain);
    console.log('Registered Fashion Brand Domains:', fashionBrandDomains);
    console.log('Domain Matching:', fashionBrandDomains.includes(emailDomain));

    // Check if the email domain is in the list of fashion brands
    if (fashionBrandDomains.includes(emailDomain)) {
        this.role = "IndustryProfessional"; // Set to IndustryProfessional otherwise
        console.log('Role set to: IndustryProfessional');
    } else {
        this.role = "Designer"; // Set role to Designer if domain matches
        console.log('Role set to: Designer');
    }
  
    this.updatedAt = Date.now();
  
    // Hash password if it has been modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
  
// Compare password method (for login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
  
// Export the User model using CommonJS
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);