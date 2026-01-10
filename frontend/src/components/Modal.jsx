import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, task, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    completed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        completed: task.completed || false
      });
      setError('');
      setShowDeleteConfirm(false);
    }
  }, [task, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // ===== TAKE EXCLUSIVE CONTROL =====
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
      
      // Focus modal immediately
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Focus first input after modal mounts
      if (firstInputRef.current) {
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    } else {
      // ===== RELEASE CONTROL =====
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    const handleFocusTrap = (e) => {
      if (!isOpen || !modalRef.current) return;
      
      // If focus is outside modal, bring it back
      if (!modalRef.current.contains(document.activeElement)) {
        e.preventDefault();
        firstInputRef.current?.focus() || modalRef.current.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('focus', handleFocusTrap, true);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('focus', handleFocusTrap, true);
      };
    }
  }, [isOpen, loading, onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Task title is required');
      }

      if (!formData.description.trim()) {
        throw new Error('Task description is required');
      }

      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }

      console.log('Saving task:', { taskId: task._id, formData });
      const result = await onSave(task._id, formData);
      console.log('Save result:', result);
      
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save task';
      setError(errorMessage);
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await onDelete();
      setLoading(false);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (!isOpen || !task) return null;

  return createPortal(
    <>
      {/* Modal - FIRST in DOM so it intercepts events BEFORE backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="modal animate-scale-in"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => {
          // Only stop propagation if clicking directly on modal background, not on children
          if (e.target === e.currentTarget) {
            e.stopPropagation();
          }
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 99999,
          width: '90%', 
          maxWidth: '600px', 
          maxHeight: '90vh', 
          overflow: 'auto', 
          backgroundColor: '#ffffff', 
          borderRadius: '1.5rem', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
          padding: '2rem', 
          border: '1px solid #e5e7eb',
          pointerEvents: 'auto'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Edit Task</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            type="button"
            style={{ backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280', padding: '0.5rem', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', transition: 'all 0.2s ease', lineHeight: 1 }}
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <p id="modal-description" className="sr-only">
          Edit task details including title, description, priority, due date, and completion status.
        </p>

        {/* Error Message */}
        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            className="animate-slide-up"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fecaca', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Delete Confirmation - High Visibility */}
        {showDeleteConfirm && (
          <div 
            style={{ 
              backgroundColor: '#fef2f2', 
              border: '3px solid #dc2626', 
              borderRadius: '0.75rem', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
            }}
            role="alertdialog"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="animate-slide-up"
          >
            <h3 id="delete-title" style={{ color: '#991b1b', margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '700' }}>
              ⚠️ Confirm Deletion
            </h3>
            <p id="delete-description" style={{ color: '#7f1d1d', margin: '0 0 1.5rem 0', fontSize: '0.9375rem', fontWeight: '500', lineHeight: '1.6' }}>
              Are you sure you want to delete this task? This action cannot be undone and the task will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{ padding: '0.75rem 1.5rem', fontWeight: '600', fontSize: '0.9375rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: '#e5e7eb', color: '#1f2937' }}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1
                }}
                onClick={confirmDelete}
                disabled={loading}
                aria-busy={loading}
                aria-label="Confirm permanent deletion"
              >
                {loading ? (
                  <>
                    <span style={{ width: '0.875rem', height: '0.875rem', border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: '0.5rem' }} aria-hidden="true"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">🗑</span> Yes, Delete Task
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!showDeleteConfirm && (
          <form 
            onSubmit={handleSave} 
            className="modal-form"
            aria-label="Edit task form"
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="modal-title-input" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                Task Title <span aria-label="required">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="modal-title-input"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }}
                disabled={loading}
                aria-required="true"
                aria-invalid={error && !formData.title.trim() ? "true" : "false"}
                autoComplete="off"
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="modal-description-input" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                Description <span aria-label="required">*</span>
              </label>
              <textarea
                id="modal-description-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none', lineHeight: '1.5' }}
                disabled={loading}
                aria-required="true"
                aria-invalid={error && !formData.description.trim() ? "true" : "false"}
                rows={5}
              />
            </div>

            {/* Priority and Due Date */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="modal-priority" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  Priority
                </label>
                <select
                  id="modal-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none' }}
                  disabled={loading}
                  aria-label="Task priority level"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="modal-due-date" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  Due Date <span aria-label="required">*</span>
                </label>
                <input
                  type="date"
                  id="modal-due-date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={getToday()}
                  style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }}
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={error && !formData.dueDate ? "true" : "false"}
                />
              </div>
            </div>

            {/* Completed Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
              <input
                type="checkbox"
                id="modal-completed"
                name="completed"
                checked={formData.completed}
                onChange={handleInputChange}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: '#2563eb' }}
                disabled={loading}
                aria-label="Mark task as completed"
              />
              <label htmlFor="modal-completed" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', cursor: 'pointer' }}>
                Mark as completed
              </label>
            </div>

            {/* Buttons */}
            <div className="modal-footer" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #f3f4f6', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                style={{
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8125rem, 3vw, 0.9375rem)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1
                }}
                onClick={handleDeleteClick}
                disabled={loading}
                aria-label="Delete this task"
              >
                <span aria-hidden="true">🗑</span>
                Delete
              </button>
              <div style={{ display: 'flex', gap: '0.75rem', flex: '1 1 auto', minWidth: '200px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={{ padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)', fontWeight: '600', fontSize: 'clamp(0.8125rem, 3vw, 0.9375rem)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap', backgroundColor: '#e5e7eb', color: '#1f2937', flex: '1 1 auto', minWidth: '80px', justifyContent: 'center' }}
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Cancel editing"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8125rem, 3vw, 0.9375rem)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    flex: '1 1 auto',
                    minWidth: '120px',
                    justifyContent: 'center',
                    opacity: loading ? 0.7 : 1
                  }}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span style={{ width: '0.875rem', height: '0.875rem', border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">💾</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Backdrop - LAST in DOM so it doesn't intercept modal events */}
      <div 
        className="modal-backdrop animate-fade-in"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-hidden="true"
        style={{ 
          pointerEvents: 'auto',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99998
        }}
      />
    </>,
    document.body
  );
};

export default Modal;