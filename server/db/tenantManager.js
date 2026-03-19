const mongoose = require('mongoose');

const connectionCache = {};
let coreConnection = null;

/**
 * Initializes and returns the core database connection (halleyx_core)
 */
const getCoreConnection = async () => {
  if (!coreConnection) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in environment');
    
    // Core connection (halleyx_core)
    coreConnection = await mongoose.createConnection(uri).asPromise();
    console.log(`Connected to Core MongoDB: ${coreConnection.name}`);
  }
  return coreConnection;
};

const initCoreDb = async () => {
  try {
    await getCoreConnection();
    console.log('Core Database is ready.');
  } catch (error) {
    console.error('Unable to connect to the core database:', error);
    throw error;
  }
};

/**
 * Gets or creates a connection for a specific tenant (userId)
 * Using the 'useDb' method for efficient database switching on a single cluster.
 */
const getTenantConnection = async (tenantId) => {
  if (connectionCache[tenantId]) {
    return connectionCache[tenantId];
  }

  try {
    const core = await getCoreConnection();
    // In MongoDB, we can use useDb to switch databases on the same connection
    // This is more efficient than creating a whole new connection pool
    const tenantDb = core.useDb(tenantId, { useCache: true });
    
    // Register models on this tenant database
    const defineOrderModel = require('../models/Order');
    const defineDashboardLayoutModel = require('../models/DashboardLayout');
    
    defineOrderModel(tenantDb);
    defineDashboardLayoutModel(tenantDb);
    
    connectionCache[tenantId] = tenantDb;
    console.log(`Switched to and cached MongoDB database for tenant: ${tenantId}`);
    return tenantDb;
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
