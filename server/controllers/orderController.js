const { Op } = require('sequelize');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  console.log('--- DEBUG: createOrder ---');
  console.log('req.models available:', req.models ? Object.keys(req.models) : 'null/undefined');
  try {
    const Order = req.models.Order;
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  console.log('--- DEBUG: getOrders ---');
  console.log('req.models available:', req.models ? Object.keys(req.models) : 'null/undefined');
  try {
    const { date } = req.query;
    let where = {};
    
    const Order = req.models.Order;

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      where.orderDate = {
        [Op.gte]: startDate,
      };
    }

    const orders = await Order.findAll({
      where,
      order: [['orderDate', 'DESC']],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Public
const updateOrder = async (req, res) => {
  try {
    const Order = req.models.Order;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Sequelize hooks handle totalAmount calculation on beforeSave
    await order.update(req.body);
    
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public
const deleteOrder = async (req, res) => {
  try {
    const Order = req.models.Order;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.destroy();
    res.status(200).json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
};
