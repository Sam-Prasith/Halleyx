import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as orderService from '../services/orderService';
import './OrderPage.css';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  product: '',
  quantity: '',
  unitPrice: '',
  status: 'Pending',
  createdBy: '',
};

function OrderFormModal({ isOpen, onClose, onSubmit, editingOrder, formError }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (editingOrder) {
      reset({
        firstName: editingOrder.firstName || '',
        lastName: editingOrder.lastName || '',
        email: editingOrder.email || '',
        phone: editingOrder.phone || '',
        streetAddress: editingOrder.streetAddress || '',
        city: editingOrder.city || '',
        state: editingOrder.state || '',
        postalCode: editingOrder.postalCode || '',
        country: editingOrder.country || '',
        product: editingOrder.product || '',
        quantity: editingOrder.quantity || '',
        unitPrice: editingOrder.unitPrice || '',
        status: editingOrder.status || 'Pending',
        createdBy: editingOrder.createdBy || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [editingOrder, reset, isOpen]);

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const totalAmount =
    quantity && unitPrice ? (Number(quantity) * Number(unitPrice)).toFixed(2) : '0.00';

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      quantity: Number(data.quantity),
      unitPrice: Number(data.unitPrice),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingOrder ? 'Edit Order' : 'Create Order'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        {formError && <div className="auth-error" style={{ margin: '0 24px' }}>{formError}</div>}

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          {/* Customer Information Section */}
          <fieldset className="form-section">
            <legend>Customer Information</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  {...register('firstName', { required: true })}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  {...register('lastName', { required: true })}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  {...register('phone', { required: true })}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Street Address *</label>
                <input
                  type="text"
                  {...register('streetAddress', { required: true })}
                  className={errors.streetAddress ? 'input-error' : ''}
                />
                {errors.streetAddress && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  {...register('city', { required: true })}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  {...register('state', { required: true })}
                  className={errors.state ? 'input-error' : ''}
                />
                {errors.state && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  type="text"
                  {...register('postalCode', { required: true })}
                  className={errors.postalCode ? 'input-error' : ''}
                />
                {errors.postalCode && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  {...register('country', { required: true })}
                  className={errors.country ? 'input-error' : ''}
                />
                {errors.country && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Order Information Section */}
          <fieldset className="form-section">
            <legend>Order Information</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Product *</label>
                <input
                  type="text"
                  {...register('product', { required: true })}
                  className={errors.product ? 'input-error' : ''}
                />
                {errors.product && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  min="1"
                  {...register('quantity', { required: true, min: 1 })}
                  className={errors.quantity ? 'input-error' : ''}
                />
                {errors.quantity && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Unit Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('unitPrice', { required: true, min: 0 })}
                  className={errors.unitPrice ? 'input-error' : ''}
                />
                {errors.unitPrice && (
                  <span className="error-msg">Please fill the field</span>
                )}
              </div>
              <div className="form-group">
                <label>Total Amount</label>
                <input
                  type="text"
                  value={totalAmount}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select {...register('status')} className="status-select">
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Created By</label>
                <input type="text" {...register('createdBy')} />
              </div>
            </div>
          </fieldset>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingOrder ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContextMenu({ x, y, onEdit, onDelete, onClose }) {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <button onClick={onEdit}>
        <span className="ctx-icon">✏️</span> Edit
      </button>
      <button onClick={onDelete} className="ctx-delete">
        <span className="ctx-icon">🗑️</span> Delete
      </button>
    </div>
  );
}

function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this order? This action cannot be undone.</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCreate = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormError('');
    try {
      if (editingOrder) {
        await orderService.updateOrder(editingOrder._id, data);
      } else {
        await orderService.createOrder(data);
      }
      setModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to save order', err);
      setFormError(err.response?.data?.message || 'Failed to save order. Please try again.');
    }
  };

  const handleRowContext = (e, order) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, order });
  };

  const handleEdit = () => {
    setEditingOrder(contextMenu.order);
    setModalOpen(true);
    setContextMenu(null);
  };

  const handleDeleteRequest = () => {
    setDeleteConfirm(contextMenu.order);
    setContextMenu(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await orderService.deleteOrder(deleteConfirm._id);
      setDeleteConfirm(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'status-pending';
    if (s === 'processing') return 'status-processing';
    if (s === 'completed') return 'status-completed';
    if (s === 'cancelled') return 'status-cancelled';
    return '';
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <div>
          <h1>Customer Orders</h1>
          <p className="subtitle">Manage and track all customer orders</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <span>+</span> Create Order
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found. Click <strong>Create Order</strong> to add one.</p>
          </div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onContextMenu={(e) => handleRowContext(e, order)}
                >
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    {order.firstName} {order.lastName}
                  </td>
                  <td>{order.email}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>₹{Number(order.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="total-cell">
                    ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button className="btn-edit-row" onClick={() => { setEditingOrder(order); setModalOpen(true); }} title="Edit">✏️</button>
                    <button className="btn-delete-row" onClick={() => setDeleteConfirm(order)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Create / Edit Modal */}
      <OrderFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingOrder(null);
          setFormError('');
        }}
        onSubmit={handleFormSubmit}
        editingOrder={editingOrder}
        formError={formError}
      />

      {/* Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
