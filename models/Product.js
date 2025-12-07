const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'general'
  },
  sinStock: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

