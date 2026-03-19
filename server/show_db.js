const { Sequelize } = require('sequelize');
const { getCoreConnection, getTenantConnection, initCoreDb } = require('./db/tenantManager');
const defineUserModel = require('./models/User');
const defineOrderModel = require('./models/Order');
const defineDashboardLayoutModel = require('./models/DashboardLayout');
require('dotenv').config();

async function showDatabase() {
  try {
    console.log('--- Halleyx MySQL Database Inspector ---');
    
    // 1. Initialize Core
    await initCoreDb();
    const coreSequelize = getCoreConnection();
    const User = defineUserModel(coreSequelize);
    
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    console.log('\n--- CORE USERS (halleyx_core) ---');
    console.table(users.map(u => u.toJSON()));

    // 2. Find all tenant databases
    const [results] = await coreSequelize.query("SHOW DATABASES LIKE 'tenant_%'");
    const tenantDbs = results.map(r => Object.values(r)[0]);
    
    if (tenantDbs.length === 0) {
      console.log('\nNo tenant databases found.');
    }

    for (const dbName of tenantDbs) {
      console.log(`\n\n--- TENANT: ${dbName} ---`);
      
      const tenantSequelize = await getTenantConnection(dbName);
      const Order = defineOrderModel(tenantSequelize);
      const DashboardLayout = defineDashboardLayoutModel(tenantSequelize);
      
      // Ensure tables exist
      await Order.sync();
      await DashboardLayout.sync();
      
      const orders = await Order.findAll();
      console.log(`\nORDERS for ${dbName}:`);
      if (orders.length > 0) {
        console.table(orders.map(o => o.toJSON()));
      } else {
        console.log('No orders found.');
      }

      const layouts = await DashboardLayout.findAll();
      console.log(`\nDASHBOARD LAYOUTS for ${dbName}:`);
      if (layouts.length > 0) {
        console.log(JSON.stringify(layouts.map(l => l.toJSON()), null, 2));
      } else {
        console.log('No layouts found.');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during database inspection:', error);
    process.exit(1);
  }
}

showDatabase();
