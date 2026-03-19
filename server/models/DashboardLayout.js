const { DataTypes } = require('sequelize');

const defineDashboardLayoutModel = (sequelize) => {
  if (sequelize.models.DashboardLayout) return sequelize.models.DashboardLayout;

  const DashboardLayout = sequelize.define('DashboardLayout', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    widgets: {
      type: DataTypes.JSON, // For array of widget objects
      defaultValue: [],
    },
  }, {
    timestamps: true, // adds updatedAt automatically
  });

  return DashboardLayout;
};

module.exports = defineDashboardLayoutModel;
