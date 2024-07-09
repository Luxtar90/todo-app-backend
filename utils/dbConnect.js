const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');  // Log de conexión exitosa
  } catch (error) {
    console.error('MongoDB connection error:', error);  // Log de errores de conexión
    process.exit(1);
  }
};

module.exports = connectDB;
