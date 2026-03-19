const mongoose = require('mongoose');

const defineDashboardLayoutModel = (connection) => {
  if (connection.models.DashboardLayout) return connection.models.DashboardLayout;

  const dashboardLayoutSchema = new mongoose.Schema({
    widgets: {
      type: Array,
      default: [],
    },
  }, {
    timestamps: true,
  });

  return connection.model('DashboardLayout', dashboardLayoutSchema);
};

module.exports = defineDashboardLayoutModel;
