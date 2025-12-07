const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Definir el schema directamente
    const adminSchema = new mongoose.Schema({
      username: String,
      password: String
    });

    const Admin = mongoose.model('Admin', adminSchema);

    const username = 'admin';
    const password = 'admin123';
    
    // Verificar si ya existe
    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Encriptar manualmente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear admin
    await Admin.create({
      username,
      password: hashedPassword
    });

    console.log('✅ Admin created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();