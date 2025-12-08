const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  label: String,
  value: String,
  priceModifier: { type: Number, default: 0 }
}, { _id: false });

const itemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  options: [optionSchema],
  notes: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  status: { 
    type: String, 
    enum: ['pendiente', 'en_preparacion', 'listo', 'entregado'], 
    default: 'pendiente' 
  },
  total: { type: Number, default: 0 },
  items: [itemSchema],
  customer: {
    name: String,
    deliveryType: { type: String, enum: ['local', 'domicilio'], default: 'local' },
    address: String,
    note: String
  },
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


