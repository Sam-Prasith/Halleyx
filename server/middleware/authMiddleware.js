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
      
      const coreSequelize = getCoreConnection();
      const User = defineUserModel(coreSequelize);
      
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      // We use the ID as the tenant database name
      // Note: If ID contains hyphens from UUID, encapsulate with backticks in queries (handled in tenantManager)
      req.tenantId = `tenant_${user.id.toString().replace(/-/g, '_')}`;
      
      const tenantSequelize = await getTenantConnection(req.tenantId);
      
      // Ensure models are registered on this connection for the current process
      const Order = defineOrderModel(tenantSequelize);
      const DashboardLayout = defineDashboardLayoutModel(tenantSequelize);

      req.tenantDb = tenantSequelize;
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
