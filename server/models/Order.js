const { DataTypes } = require('sequelize');

const defineOrderModel = (sequelize) => {
  if (sequelize.models.Order) return sequelize.models.Order;

  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    streetAddress: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    postalCode: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    product: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
    totalAmount: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    createdBy: { type: DataTypes.STRING },
    orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    hooks: {
      beforeSave: (order) => {
        if (order.quantity != null && order.unitPrice != null) {
          order.totalAmount = order.quantity * order.unitPrice;
        }
      },
    },
    timestamps: true,
  });

  return Order;
};

module.exports = defineOrderModel;
