const mongoose = require('mongoose');

const defineOrderModel = (connection) => {
  if (connection.models.Order) return connection.models.Order;

  const orderSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number },
    status: { type: String, default: 'Pending' },
    createdBy: { type: String },
    orderDate: { type: Date, default: Date.now },
  }, {
    timestamps: true,
  });

  // Pre-save hook to calculate totalAmount
  orderSchema.pre('save', function () {
    if (this.quantity != null && this.unitPrice != null) {
      this.totalAmount = this.quantity * this.unitPrice;
    }
  });

  return connection.model('Order', orderSchema);
};

module.exports = defineOrderModel;
