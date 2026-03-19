import { useState, useEffect } from 'react';
import './WidgetSettingsPanel.css';

/* ── Field options ── */
const METRIC_OPTIONS = ['Total Revenue', 'Total Orders', 'Average Order Value', 'Total Quantity'];
const AGGREGATION_OPTIONS = ['Sum', 'Average', 'Count'];
const DATA_FORMAT_OPTIONS = ['Number', 'Currency'];
const AXIS_OPTIONS = ['product', 'firstName', 'city', 'state', 'country', 'orderDate', 'status'];
const VALUE_AXIS_OPTIONS = ['totalAmount', 'quantity', 'unitPrice'];
const COLUMN_OPTIONS = ['firstName', 'lastName', 'email', 'phone', 'product', 'quantity', 'unitPrice', 'totalAmount', 'status', 'orderDate', 'city', 'country'];
const PAGINATION_OPTIONS = [5, 10, 15];
const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18];

/* ── Defaults per type ── */
const DEFAULT_CONFIG = {
  'kpi-card': { title: 'KPI Card', description: '', width: 2, height: 2, metric: 'Total Revenue', aggregation: 'Sum', dataFormat: 'Currency', decimalPrecision: 2 },
  'bar-chart': { title: 'Bar Chart', description: '', width: 5, height: 5, xAxis: 'product', yAxis: 'totalAmount', color: '#6366f1', showDataLabel: false },
  'line-chart': { title: 'Line Chart', description: '', width: 5, height: 5, xAxis: 'orderDate', yAxis: 'totalAmount', color: '#818cf8', showDataLabel: false },
  'area-chart': { title: 'Area Chart', description: '', width: 5, height: 5, xAxis: 'orderDate', yAxis: 'totalAmount', color: '#818cf8', showDataLabel: false },
  'scatter-chart': { title: 'Scatter Chart', description: '', width: 5, height: 5, xAxis: 'quantity', yAxis: 'totalAmount', color: '#818cf8', showDataLabel: false },
  'pie-chart': { title: 'Pie Chart', description: '', width: 4, height: 4, chartDataKey: 'status', showLegend: true },
  'data-table': { title: 'Data Table', description: '', width: 4, height: 4, columns: ['firstName', 'lastName', 'product', 'totalAmount', 'status'], sortBy: 'orderDate', pagination: 10, enableFilter: false, filterRows: [], fontSize: 14, headerBgColor: '#54bd95' },
};

const isChartType = (t) => ['bar-chart', 'line-chart', 'area-chart', 'scatter-chart'].includes(t);

export default function WidgetSettingsPanel({ widget, onSave, onClose }) {
  const defaults = DEFAULT_CONFIG[widget?.type] || {};
  const [config, setConfig] = useState({ ...defaults, ...widget?.configuration, title: widget?.title || defaults.title, description: widget?.description || defaults.description || '', width: widget?.width || defaults.width, height: widget?.height || defaults.height });

  useEffect(() => {
    if (widget) {
      const d = DEFAULT_CONFIG[widget.type] || {};
      setConfig({ ...d, ...widget.configuration, title: widget.title || d.title, description: widget.description || d.description || '', width: widget.width || d.width, height: widget.height || d.height });
    }
  }, [widget]);

  if (!widget) return null;

  const set = (key, val) => setConfig((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const { title, description, width, height, ...rest } = config;
    onSave(widget.widgetId, { title, description, width: Number(width), height: Number(height), configuration: rest });
  };

  /* ── Toggle column in multiselect ── */
  const toggleColumn = (col) => {
    const cols = config.columns || [];
    set('columns', cols.includes(col) ? cols.filter((c) => c !== col) : [...cols, col]);
  };

  /* ── Filter rows ── */
  const addFilterRow = () => set('filterRows', [...(config.filterRows || []), { column: 'product', operator: 'equals', value: '' }]);
  const updateFilterRow = (i, key, val) => {
    const rows = [...(config.filterRows || [])];
    rows[i] = { ...rows[i], [key]: val };
    set('filterRows', rows);
  };
  const removeFilterRow = (i) => set('filterRows', (config.filterRows || []).filter((_, idx) => idx !== i));

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sp-header">
          <h2>Widget Settings</h2>
          <button className="sp-close" onClick={onClose}>&times;</button>
        </div>

        <div className="sp-body">
          {/* ── Common fields ── */}
          <div className="sp-section">
            <label className="sp-label">Title</label>
            <input className="sp-input" value={config.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="sp-section">
            <label className="sp-label">Description</label>
            <textarea className="sp-textarea" rows={2} value={config.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="sp-row">
            <div className="sp-section sp-half">
              <label className="sp-label">Width (columns)</label>
              <input type="number" className="sp-input" min={1} max={12} value={config.width} onChange={(e) => set('width', e.target.value)} />
            </div>
            <div className="sp-section sp-half">
              <label className="sp-label">Height (rows)</label>
              <input type="number" className="sp-input" min={1} max={12} value={config.height} onChange={(e) => set('height', e.target.value)} />
            </div>
          </div>

          <hr className="sp-divider" />

          {/* ── KPI fields ── */}
          {widget.type === 'kpi-card' && (
            <>
              <div className="sp-section">
                <label className="sp-label">Select Metric</label>
                <select className="sp-select" value={config.metric || ''} onChange={(e) => set('metric', e.target.value)}>
                  {METRIC_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Aggregation</label>
                <select className="sp-select" value={config.aggregation || 'Sum'} onChange={(e) => set('aggregation', e.target.value)}>
                  {AGGREGATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Data Format</label>
                <select className="sp-select" value={config.dataFormat || 'Number'} onChange={(e) => set('dataFormat', e.target.value)}>
                  {DATA_FORMAT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Decimal Precision</label>
                <input type="number" className="sp-input" min={0} max={6} value={config.decimalPrecision ?? 2} onChange={(e) => set('decimalPrecision', Number(e.target.value))} />
              </div>
            </>
          )}

          {/* ── Chart fields (Bar/Line/Area/Scatter) ── */}
          {isChartType(widget.type) && (
            <>
              <div className="sp-section">
                <label className="sp-label">X-Axis</label>
                <select className="sp-select" value={config.xAxis || ''} onChange={(e) => set('xAxis', e.target.value)}>
                  {AXIS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Y-Axis</label>
                <select className="sp-select" value={config.yAxis || ''} onChange={(e) => set('yAxis', e.target.value)}>
                  {VALUE_AXIS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Color</label>
                <div className="sp-color-row">
                  <input type="color" className="sp-color" value={config.color || '#6366f1'} onChange={(e) => set('color', e.target.value)} />
                  <span className="sp-color-val">{config.color || '#6366f1'}</span>
                </div>
              </div>
              <div className="sp-section sp-check-row">
                <input type="checkbox" id="showDataLabel" checked={!!config.showDataLabel} onChange={(e) => set('showDataLabel', e.target.checked)} />
                <label htmlFor="showDataLabel">Show Data Labels</label>
              </div>
            </>
          )}

          {/* ── Pie Chart fields ── */}
          {widget.type === 'pie-chart' && (
            <>
              <div className="sp-section">
                <label className="sp-label">Chart Data</label>
                <select className="sp-select" value={config.chartDataKey || 'status'} onChange={(e) => set('chartDataKey', e.target.value)}>
                  {['status', 'product', 'city', 'country'].map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="sp-section sp-check-row">
                <input type="checkbox" id="showLegend" checked={config.showLegend !== false} onChange={(e) => set('showLegend', e.target.checked)} />
                <label htmlFor="showLegend">Show Legend</label>
              </div>
            </>
          )}

          {/* ── Table fields ── */}
          {widget.type === 'data-table' && (
            <>
              <div className="sp-section">
                <label className="sp-label">Columns (multiselect)</label>
                <div className="sp-multiselect">
                  {COLUMN_OPTIONS.map((col) => (
                    <label key={col} className={`sp-ms-chip ${(config.columns || []).includes(col) ? 'active' : ''}`}>
                      <input type="checkbox" checked={(config.columns || []).includes(col)} onChange={() => toggleColumn(col)} />
                      {col}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sp-section">
                <label className="sp-label">Sort By</label>
                <select className="sp-select" value={config.sortBy || 'orderDate'} onChange={(e) => set('sortBy', e.target.value)}>
                  {COLUMN_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Pagination (rows per page)</label>
                <select className="sp-select" value={config.pagination || 10} onChange={(e) => set('pagination', Number(e.target.value))}>
                  {PAGINATION_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="sp-section sp-check-row">
                <input type="checkbox" id="enableFilter" checked={!!config.enableFilter} onChange={(e) => set('enableFilter', e.target.checked)} />
                <label htmlFor="enableFilter">Enable Filters</label>
              </div>
              {config.enableFilter && (
                <div className="sp-section">
                  <label className="sp-label">Filter Rows</label>
                  {(config.filterRows || []).map((fr, i) => (
                    <div key={i} className="sp-filter-row">
                      <select className="sp-select sp-sm" value={fr.column} onChange={(e) => updateFilterRow(i, 'column', e.target.value)}>
                        {COLUMN_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select className="sp-select sp-sm" value={fr.operator} onChange={(e) => updateFilterRow(i, 'operator', e.target.value)}>
                        <option value="equals">equals</option>
                        <option value="contains">contains</option>
                        <option value="gt">greater than</option>
                        <option value="lt">less than</option>
                      </select>
                      <input className="sp-input sp-sm" value={fr.value} onChange={(e) => updateFilterRow(i, 'value', e.target.value)} placeholder="Value" />
                      <button className="sp-filter-del" onClick={() => removeFilterRow(i)}>✕</button>
                    </div>
                  ))}
                  <button className="sp-add-filter" onClick={addFilterRow}>+ Add Filter</button>
                </div>
              )}
              <div className="sp-section">
                <label className="sp-label">Font Size</label>
                <select className="sp-select" value={config.fontSize || 14} onChange={(e) => set('fontSize', Number(e.target.value))}>
                  {FONT_SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
              <div className="sp-section">
                <label className="sp-label">Header Background Color</label>
                <div className="sp-color-row">
                  <input type="color" className="sp-color" value={config.headerBgColor || '#54bd95'} onChange={(e) => set('headerBgColor', e.target.value)} />
                  <span className="sp-color-val">{config.headerBgColor || '#54bd95'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sp-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save-settings" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
