// @desc    Get saved dashboard layout
// @route   GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const DashboardLayout = req.models.DashboardLayout;
    let dashboard = await DashboardLayout.findOne();
    if (!dashboard) {
      dashboard = await DashboardLayout.create({ widgets: [] });
    }
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save (create) dashboard layout
// @route   POST /api/dashboard
const saveDashboard = async (req, res) => {
  try {
    const DashboardLayout = req.models.DashboardLayout;
    let dashboard = await DashboardLayout.findOne();
    if (dashboard) {
      dashboard.widgets = req.body.widgets || [];
      await dashboard.save();
    } else {
      dashboard = await DashboardLayout.create({ widgets: req.body.widgets || [] });
    }
    res.status(201).json(dashboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update dashboard layout
// @route   PUT /api/dashboard
const updateDashboard = async (req, res) => {
  try {
    const DashboardLayout = req.models.DashboardLayout;
    let dashboard = await DashboardLayout.findOne();
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }
    dashboard.widgets = req.body.widgets || dashboard.widgets;
    await dashboard.save();
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getDashboard, saveDashboard, updateDashboard };
