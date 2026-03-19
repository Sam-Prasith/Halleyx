import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList,
} from 'recharts';
import * as dashboardService from '../services/dashboardService';
import * as orderService from '../services/orderService';
import './DashboardPage.css';

/* ── Date filter options ── */
const DATE_FILTERS = [
  { label: 'All time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
];

/* ── Color palette ── */
const COLORS = ['#10b981', '#34d399', '#6366f1', '#818cf8', '#a5b4fc', '#f59e0b', '#ef4444', '#ec4899'];
const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f8fafc', fontFamily: 'Outfit' };
const TICK_STYLE = { fill: '#6b7a90', fontSize: 11 };

/* ═══════════════════════════════════════════════════════════════
   HELPERS — build chart data from orders + widget configuration
   ═══════════════════════════════════════════════════════════════ */

/** Group orders by a categorical field and sum a numeric field */
function groupBy(orders, groupField, valueField) {
  const map = {};
  orders.forEach((o) => {
    let key = o[groupField];
    if (key instanceof Date || groupField === 'orderDate') {
      key = new Date(key).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    if (key == null) key = 'N/A';
    const val = Number(o[valueField]) || 0;
    map[key] = (map[key] || 0) + val;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/** Distribution — count occurrences of each unique value in a field */
function distribution(orders, field) {
  const map = {};
  orders.forEach((o) => {
    const key = o[field] || 'N/A';
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/** Map a metric name to the actual field */
function metricField(metric) {
  switch (metric) {
    case 'Total Revenue': return 'totalAmount';
    case 'Total Orders': return '__count';
    case 'Average Order Value': return 'totalAmount';
    case 'Total Quantity': return 'quantity';
    default: return 'totalAmount';
  }
}

/* ═══════════════  KPI Card  ═══════════════ */
function KPICard({ widget, orders }) {
  const cfg = widget.configuration || {};
  const field = metricField(cfg.metric);
  const agg = cfg.aggregation || 'Sum';
  const fmt = cfg.dataFormat || 'Number';
  const prec = cfg.decimalPrecision ?? 2;

  let rawValue = 0;
  if (field === '__count') {
    rawValue = orders.length;
  } else {
    const sum = orders.reduce((s, o) => s + (Number(o[field]) || 0), 0);
    if (agg === 'Sum') rawValue = sum;
    else if (agg === 'Average') rawValue = orders.length ? sum / orders.length : 0;
    else if (agg === 'Count') rawValue = orders.length;
  }

  const display =
    fmt === 'Currency'
      ? `₹${rawValue.toLocaleString('en-IN', { minimumFractionDigits: prec, maximumFractionDigits: prec })}`
      : rawValue.toLocaleString('en-IN', { minimumFractionDigits: prec, maximumFractionDigits: prec });

  return (
    <div className="dash-kpi">
      <span className="kpi-label">{widget.title || 'KPI'}</span>
      <span className="kpi-value">{display}</span>
      <span className="kpi-sub">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
    </div>
  );
}

/* ═══════════════  Chart renderers  ═══════════════ */
function ChartBarWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const data = groupBy(orders, cfg.xAxis || 'product', cfg.yAxis || 'totalAmount');
  const color = cfg.color || '#6366f1';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={TICK_STYLE} />
        <YAxis tick={TICK_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
          {cfg.showDataLabel && <LabelList dataKey="value" position="top" fill="#c5cdd8" fontSize={11} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartLineWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const data = groupBy(orders, cfg.xAxis || 'orderDate', cfg.yAxis || 'totalAmount');
  const color = cfg.color || '#818cf8';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={TICK_STYLE} />
        <YAxis tick={TICK_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 4 }}>
          {cfg.showDataLabel && <LabelList dataKey="value" position="top" fill="#c5cdd8" fontSize={11} />}
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}

function ChartAreaWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const data = groupBy(orders, cfg.xAxis || 'orderDate', cfg.yAxis || 'totalAmount');
  const color = cfg.color || '#818cf8';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={TICK_STYLE} />
        <YAxis tick={TICK_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="value" stroke={color} fill={color + '26'}>
          {cfg.showDataLabel && <LabelList dataKey="value" position="top" fill="#c5cdd8" fontSize={11} />}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartScatterWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const data = groupBy(orders, cfg.xAxis || 'product', cfg.yAxis || 'totalAmount');
  const color = cfg.color || '#818cf8';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" type="category" tick={TICK_STYLE} />
        <YAxis dataKey="value" tick={TICK_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Scatter data={data} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function ChartPieWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const data = distribution(orders, cfg.chartDataKey || 'status');
  const showLegend = cfg.showLegend !== false;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        {showLegend && <Legend wrapperStyle={{ color: '#6b7a90', fontSize: 11 }} />}
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════  Table widget  ═══════════════ */
function TableWidget({ widget, orders }) {
  const cfg = widget.configuration || {};
  const columns = cfg.columns && cfg.columns.length ? cfg.columns : ['firstName', 'lastName', 'product', 'totalAmount', 'status'];
  const sortBy = cfg.sortBy || 'orderDate';
  const pageSize = cfg.pagination || 10;
  const fontSize = cfg.fontSize || 14;
  const headerBg = cfg.headerBgColor || '#54bd95';
  const enableFilter = cfg.enableFilter || false;
  const filterRows = cfg.filterRows || [];

  const [page, setPage] = useState(0);

  /* Apply filters */
  let filtered = [...orders];
  if (enableFilter && filterRows.length) {
    filterRows.forEach((fr) => {
      if (!fr.value && fr.operator !== 'equals') return;
      filtered = filtered.filter((o) => {
        const val = String(o[fr.column] ?? '').toLowerCase();
        const target = String(fr.value).toLowerCase();
        switch (fr.operator) {
          case 'equals': return val === target;
          case 'contains': return val.includes(target);
          case 'gt': return Number(o[fr.column]) > Number(fr.value);
          case 'lt': return Number(o[fr.column]) < Number(fr.value);
          default: return true;
        }
      });
    });
  }

  /* Sort */
  filtered.sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    if (av == null) return 1;
    if (bv == null) return -1;
    return av > bv ? -1 : av < bv ? 1 : 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const formatCell = (col, value) => {
    if (col === 'totalAmount' || col === 'unitPrice') return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (col === 'orderDate') return new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    return value;
  };

  return (
    <div className="dash-table-wrapper" style={{ fontSize }}>
      <table className="dash-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={{ background: headerBg, color: '#fff' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#6b7a90' }}>No data</td></tr>
          )}
          {paged.map((o) => (
            <tr key={o._id}>
              {columns.map((col) => (
                <td key={col}>
                  {col === 'status' ? (
                    <span className={`mini-badge st-${(o.status || '').toLowerCase()}`}>{o.status}</span>
                  ) : (
                    formatCell(col, o[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="table-pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════  Widget Renderer (dispatcher)  ═══════════════ */
function WidgetRenderer({ widget, orders }) {
  switch (widget.type) {
    case 'bar-chart': return <ChartBarWidget widget={widget} orders={orders} />;
    case 'line-chart': return <ChartLineWidget widget={widget} orders={orders} />;
    case 'area-chart': return <ChartAreaWidget widget={widget} orders={orders} />;
    case 'scatter-chart': return <ChartScatterWidget widget={widget} orders={orders} />;
    case 'pie-chart': return <ChartPieWidget widget={widget} orders={orders} />;
    case 'data-table': return <TableWidget widget={widget} orders={orders} />;
    case 'kpi-card': return <KPICard widget={widget} orders={orders} />;
    default: return <div className="unknown-widget">Unknown widget type</div>;
  }
}

/* ═══════════════  Main Dashboard Page  ═══════════════ */
export default function DashboardPage() {
  const [layout, setLayout] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDateParam = useCallback((filter) => {
    if (!filter) return undefined;
    const now = new Date();
    if (filter === 'today') {
      return now.toISOString().split('T')[0];
    }
    const daysAgo = new Date(now);
    daysAgo.setDate(now.getDate() - Number(filter));
    return daysAgo.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashData, orderData] = await Promise.all([
          dashboardService.getDashboardLayout(),
          orderService.getOrders(getDateParam(dateFilter)),
        ]);
        setLayout(dashData);
        setOrders(orderData);
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFilter, getDateParam]);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="spinner"></div>
        <p>Loading dashboard…</p>
      </div>
    );
  }

  const widgets = layout?.widgets || [];

  return (
    <div className="dashboard-page">
      <div className="dash-topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Real-time overview of your data</p>
        </div>
        <div className="dash-topbar-right">
          <select
            className="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            {DATE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <button className="btn-configure" onClick={() => navigate('/dashboard/config')}>
            ⚙️ Configure
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="dash-empty">
          <p>No widgets configured yet.</p>
          <button className="btn-configure" onClick={() => navigate('/dashboard/config')}>
            ⚙️ Configure Dashboard
          </button>
        </div>
      ) : (
        <div className="dash-grid">
          {widgets.map((w) => (
            <div
              key={w.widgetId}
              className="dash-widget-card"
              style={{
                gridColumn: `span ${w.width || 4}`,
                gridRow: `span ${w.height || 3}`,
              }}
            >
              <div className="dwc-header">
                <span className="dwc-title">{w.title}</span>
              </div>
              <div className="dwc-body">
                <WidgetRenderer widget={w} orders={orders} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
