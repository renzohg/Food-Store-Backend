const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { authenticateAdmin } = require('../middleware/auth');

const generateOrderId = () => {
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
};

// Crear pedido (público, usado por checkout)
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const orderId = payload.orderId || generateOrderId();
    const order = new Order({
      ...payload,
      orderId
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar pedidos (solo admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'todos') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { _id: search }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener pedido por ID (orderId o _id) - admin
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    let { id } = req.params;
    // Decodificar el ID en caso de que tenga caracteres especiales codificados
    id = decodeURIComponent(id);
    
    // Intentar buscar por orderId primero (más común y no requiere validación de ObjectId)
    let order = await Order.findOne({ orderId: id });
    
    // Si no se encuentra, intentar por _id solo si es un ObjectId válido
    if (!order && mongoose.Types.ObjectId.isValid(id)) {
      try {
        order = await Order.findById(id);
      } catch (mongooseError) {
        // Si falla, continuar sin error
      }
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error al buscar pedido:', error);
    res.status(500).json({ message: error.message || 'Error al buscar el pedido' });
  }
});

// Actualizar estado - admin
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Estado es requerido' });
    }
    const order = await Order.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


