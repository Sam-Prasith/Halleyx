const jwt = require('jsonwebtoken');
const { getCoreConnection, getTenantConnection } = require('../db/tenantManager');
const defineUserModel = require('../models/User');
const defineOrderModel = require('../models/Order');
const defineDashboardLayoutModel = require('../models/DashboardLayout');

const JWT_SECRET = process.env.JWT_SECRET || 'halleyx_secret_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const coreConnection = await getCoreConnection();
      const User = defineUserModel(coreConnection);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      // We use the ID as the tenant database name
      req.tenantId = `tenant_${user._id.toString()}`;
      
      const tenantDb = await getTenantConnection(req.tenantId);
      
      // Models are already registered in getTenantConnection, but we can grab them here
      const Order = defineOrderModel(tenantDb);
      const DashboardLayout = defineDashboardLayoutModel(tenantDb);

      req.tenantDb = tenantDb;
      req.models = { Order, DashboardLayout };
      
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
