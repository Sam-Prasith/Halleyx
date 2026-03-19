import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import * as dashboardService from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import WidgetSettingsPanel from '../components/WidgetSettingsPanel';
import './DashboardConfigPage.css';

/* ───────── Widget catalogue ───────── */
const WIDGET_CATALOG = {
  Charts: [
    { type: 'bar-chart', title: 'Bar Chart', icon: '📊' },
    { type: 'line-chart', title: 'Line Chart', icon: '📈' },
    { type: 'pie-chart', title: 'Pie Chart', icon: '🥧' },
    { type: 'area-chart', title: 'Area Chart', icon: '📉' },
    { type: 'scatter-chart', title: 'Scatter Chart', icon: '⚬' },
  ],
  Tables: [
    { type: 'data-table', title: 'Data Table', icon: '📋' },
  ],
  KPIs: [
    { type: 'kpi-card', title: 'KPI Card', icon: '🎯' },
  ],
};

/* ───────── Sidebar draggable item ───────── */
function SidebarItem({ widget }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${widget.type}`,
    data: { fromSidebar: true, widget },
  });

  return (
    <div
      ref={setNodeRef}
      className={`sidebar-widget ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="widget-icon">{widget.icon}</span>
      <span className="widget-label">{widget.title}</span>
    </div>
  );
}

/* ───────── Canvas drop zone ───────── */
function CanvasDropZone({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas' });
  return (
    <div ref={setNodeRef} className={`canvas-grid ${isOver ? 'canvas-over' : ''}`}>
      {children}
    </div>
  );
}

/* ───────── Placed widget card ───────── */
function PlacedWidget({ widget, onDelete, onSettings }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    gridColumn: `span ${widget.width || 4}`,
    gridRow: `span ${widget.height || 3}`,
  };

  const iconMap = {
    'bar-chart': '📊', 'line-chart': '📈', 'pie-chart': '🥧',
    'area-chart': '📉', 'scatter-chart': '⚬',
    'data-table': '📋', 'kpi-card': '🎯',
  };

  return (
    <div
      className="placed-widget"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pw-content">
        <span className="pw-icon">{iconMap[widget.type] || '📦'}</span>
        <span className="pw-title">{widget.title}</span>
        <span className="pw-type">{widget.type}</span>
      </div>
      {hovered && (
        <div className="pw-actions">
          <button className="pw-btn pw-settings" onClick={() => onSettings(widget)} title="Settings">
            ⚙️
          </button>
          <button className="pw-btn pw-delete" onClick={() => onDelete(widget.widgetId)} title="Delete">
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function DashboardConfigPage() {
  const [widgets, setWidgets] = useState([]);
  const [activeWidget, setActiveWidget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [settingsWidget, setSettingsWidget] = useState(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const generateId = () => Math.random().toString(36).substring(2, 10);

  /* ── Load existing layout on mount ── */
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const data = await dashboardService.getDashboardLayout();
        if (data?.widgets?.length) {
          setWidgets(data.widgets);
        }
      } catch (err) {
        console.error('Failed to load dashboard layout', err);
      }
    };
    loadLayout();
  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.fromSidebar) {
      setActiveWidget(active.data.current.widget);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveWidget(null);

    if (!over || over.id !== 'canvas') return;

    if (active.data.current?.fromSidebar) {
      const catalog = active.data.current.widget;
      const newWidget = {
        widgetId: generateId(),
        type: catalog.type,
        title: catalog.title,
        description: '',
        width: catalog.type === 'kpi-card' ? 3 : catalog.type === 'data-table' ? 12 : 4,
        height: catalog.type === 'kpi-card' ? 2 : catalog.type === 'data-table' ? 4 : 3,
        position: { x: 0, y: 0 },
        configuration: {},
      };
      setWidgets((prev) => [...prev, newWidget]);
    }
  };

  const handleDelete = useCallback((widgetId) => {
    setWidgets((prev) => prev.filter((w) => w.widgetId !== widgetId));
  }, []);

  const handleSettings = useCallback((widget) => {
    setSettingsWidget(widget);
  }, []);

  const handleSettingsSave = useCallback(async (widgetId, updates) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.widgetId === widgetId
          ? { ...w, title: updates.title, description: updates.description, width: updates.width, height: updates.height, configuration: { ...w.configuration, ...updates.configuration } }
          : w
      )
    );
    setSettingsWidget(null);
    // Persist via PUT
    try {
      const updated = widgets.map((w) =>
        w.widgetId === widgetId
          ? { ...w, title: updates.title, description: updates.description, width: updates.width, height: updates.height, configuration: { ...w.configuration, ...updates.configuration } }
          : w
      );
      await dashboardService.updateDashboardLayout(updated);
    } catch (err) {
      console.error('Failed to persist widget settings', err);
    }
  }, [widgets]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dashboardService.saveDashboardLayout(widgets);
      alert('Dashboard configuration saved!');
    } catch (err) {
      console.error('Failed to save dashboard', err);
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="config-page">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ── Sidebar ── */}
        <aside className="config-sidebar">
          <div className="sidebar-header">
            <h2>Widgets</h2>
            <p>Drag widgets to the canvas</p>
          </div>
          {Object.entries(WIDGET_CATALOG).map(([group, items]) => (
            <div key={group} className="widget-group">
              <h3 className="group-title">{group}</h3>
              <div className="group-items">
                {items.map((w) => (
                  <SidebarItem key={w.type} widget={w} />
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* ── Canvas ── */}
        <main className="config-main">
          <div className="config-topbar">
            <div>
              <h1>Dashboard Configuration</h1>
              <p className="subtitle">Design your dashboard layout</p>
            </div>
            <div className="topbar-actions">
              <button className="btn-view" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Configuration'}
              </button>
            </div>
          </div>

          <CanvasDropZone>
            {widgets.length === 0 && (
              <div className="canvas-empty">
                <p>Drag widgets from the sidebar and drop them here</p>
              </div>
            )}
            {widgets.map((w) => (
              <PlacedWidget
                key={w.widgetId}
                widget={w}
                onDelete={handleDelete}
                onSettings={handleSettings}
              />
            ))}
          </CanvasDropZone>
        </main>

        {/* ── Drag overlay (placeholder) ── */}
        <DragOverlay>
          {activeWidget ? (
            <div className="drag-preview">
              <span className="dp-icon">{activeWidget.icon}</span>
              <span>{activeWidget.title}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── Widget Settings Side Panel ── */}
      {settingsWidget && (
        <WidgetSettingsPanel
          widget={settingsWidget}
          onSave={handleSettingsSave}
          onClose={() => setSettingsWidget(null)}
        />
      )}
    </div>
  );
}
