// models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const productCounter = mongoose.model('productCounter', counterSchema);

export default productCounter;
