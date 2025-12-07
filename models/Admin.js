const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// ELIMINA TEMPORALMENTE ESTE HOOK (coméntalo o elimínalo)
/*
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    if (next) next();
    return;
  }
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    if (next) next();
  } catch (error) {
    if (next) next(error);
  }
});
*/

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);