const { Sequelize } = require('sequelize');

const connectionCache = {};
let coreSequelize = null;

/**
 * Initializes and returns the core database connection (halleyx_core)
 */
const getCoreConnection = () => {
  if (!coreSequelize) {
    coreSequelize = new Sequelize(
      process.env.MYSQL_CORE_DB || 'halleyx_core',
      process.env.MYSQL_USER || 'root',
      process.env.MYSQL_PASSWORD || 'root',
      {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
      }
    );
    console.log(`Connected to Core MySQL at ${process.env.MYSQL_CORE_DB || 'halleyx_core'}`);
  }
  return coreSequelize;
};

const initCoreDb = async () => {
  try {
    // First, connect WITHOUT a database to ensure it exists
    const tempSequelize = new Sequelize(
      '',
      process.env.MYSQL_USER || 'root',
      process.env.MYSQL_PASSWORD || 'root',
      {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
      }
    );
    
    const coreDbName = process.env.MYSQL_CORE_DB || 'halleyx_core';
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${coreDbName}\`;`);
    await tempSequelize.close();

    const sequelize = getCoreConnection();
    await sequelize.authenticate();
    
    console.log(`Core Database '${coreDbName}' is ready.`);
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the core database:', error);
    throw error;
  }
};

/**
 * Gets or creates a connection for a specific tenant (userId)
 */
const getTenantConnection = async (tenantId) => {
  if (connectionCache[tenantId]) {
    return connectionCache[tenantId];
  }

  // Ensure the tenant database exists
  const core = getCoreConnection();
  try {
    // Note: Creating database dynamically requires appropriate MySQL permissions
    await core.query(`CREATE DATABASE IF NOT EXISTS \`${tenantId}\`;`);
    console.log(`Ensured database exists for tenant: ${tenantId}`);
  } catch (error) {
    console.error(`Error ensuring database for tenant ${tenantId}:`, error);
    // Continue anyway as it might already exist but query failed due to permissions
  }

  const tenantSequelize = new Sequelize(
    tenantId,
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || 'root',
    {
      host: process.env.MYSQL_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
    }
  );

  try {
    await tenantSequelize.authenticate();
    
    // Initialize & Sync models ONCE when connection is created
    const defineOrderModel = require('../models/Order');
    const defineDashboardLayoutModel = require('../models/DashboardLayout');
    const Order = defineOrderModel(tenantSequelize);
    const DashboardLayout = defineDashboardLayoutModel(tenantSequelize);
    
    await Order.sync();
    await DashboardLayout.sync();

    connectionCache[tenantId] = tenantSequelize;
    console.log(`Created and synced new Sequelize connection for tenant: ${tenantId}`);
    return tenantSequelize;
  } catch (error) {
    console.error(`Unable to connect to tenant database ${tenantId}:`, error);
    throw error;
  }
};

module.exports = {
  initCoreDb,
  getCoreConnection,
  getTenantConnection
};
