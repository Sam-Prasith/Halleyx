// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
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
  try {
    const { date } = req.query;
    let where = {};
    
    const Order = req.models.Order;

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.orderDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const orders = await Order.find(where).sort({ orderDate: -1 });
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
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove _id from req.body to prevent immutable field errors
    const updates = { ...req.body };
    delete updates._id;

    // Use order.set() which is the proper way to assign multiple fields in Mongoose
    order.set(updates);
    await order.save();
    
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
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.deleteOne();
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
