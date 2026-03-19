require('dotenv').config();
const { initCoreDb, getTenantConnection } = require('./db/tenantManager');
const defineUserModel = require('./models/User');
const defineOrderModel = require('./models/Order');

async function test() {
  console.log('--- Final Clean-Run Verification ---');
  try {
    const coreSequelize = await initCoreDb();
    const User = defineUserModel(coreSequelize);
    await User.sync();
    console.log('✅ Core Connection OK.');

    const testEmail = `verify_${Date.now()}@test.com`;
    const testUser = await User.create({
      name: 'Verification User',
      email: testEmail,
      password: 'password123'
    });
    console.log(`✅ User Creation OK. ID: ${testUser.id}`);

    const tenantId = `tenant_${testUser.id.toString().replace(/-/g, '_')}`;
    const tenantSequelize = await getTenantConnection(tenantId);
    const Order = defineOrderModel(tenantSequelize);
    await Order.sync();
    console.log(`✅ Tenant DB (${tenantId}) Creation & Order Sync OK.`);

    const order = await Order.create({
      firstName: 'Verify',
      lastName: 'Check',
      email: testEmail,
      phone: '0000000000',
      streetAddress: 'Verification St',
      city: 'Test',
      state: 'TS',
      postalCode: '00000',
      country: 'TestLand',
      product: 'Verified Gadget',
      quantity: 1,
      unitPrice: 100,
      createdBy: testUser.id
    });
    console.log(`✅ Order Creation OK. Total: ${order.totalAmount}`);

    console.log('--- FINAL VERIFICATION: SUCCESS ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ FINAL VERIFICATION FAILED:');
    console.error(error);
    process.exit(1);
  }
}

test();
