import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axiosInstance';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('Task title is required');
      }

      if (!description.trim()) {
        throw new Error('Task description is required');
      }

      if (!dueDate) {
        throw new Error('Due date is required');
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate
      };

      await API.post('/tasks', taskData);

      setLoading(false);
      setSuccess(true);

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');

      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to create task. Please check if the backend is running.');
      console.error('Form submission error:', err);
    }
  };

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <main 
      className="add-task-container"
      role="main"
      aria-label="Add new task page"
    >
      <div className="add-task-card animate-slide-up">
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: '#e0e7ff', borderRadius: '0.75rem', color: '#2563eb' }} aria-hidden="true">+</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.375rem, 6vw, 1.75rem)', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }} className="add-task-title">Create New Task</h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }} className="add-task-subtitle">Add a new task to your list</p>
        </div>

        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fecaca', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            className="animate-slide-up"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div 
            role="alert"
            aria-live="polite"
            style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #a7f3d0', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            className="animate-slide-up"
          >
            <span aria-hidden="true">✅</span>
            <span>Task created successfully! Redirecting...</span>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="add-task-form"
          aria-label="Task creation form"
          noValidate
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
              Task Title <span aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }}
              aria-required="true"
              aria-invalid={error && !title.trim() ? "true" : "false"}
              autoComplete="off"
            />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>Give your task a clear, concise name</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
              Description <span aria-label="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your task in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none', lineHeight: '1.5' }}
              aria-required="true"
              aria-invalid={error && !description.trim() ? "true" : "false"}
              rows={5}
            />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>Add details to help you remember what to do</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="priority" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
                style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none' }}
                aria-label="Task priority level"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="dueDate" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                Due Date <span aria-label="required">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getToday()}
                required
                disabled={loading}
                style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none' }}
                aria-required="true"
                aria-invalid={error && !dueDate ? "true" : "false"}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: 'clamp(0.625rem, 2vw, 0.875rem) clamp(1rem, 4vw, 1.5rem)',
                fontWeight: '600',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                flex: '1 1 auto',
                minWidth: '120px',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1
              }}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.125rem' }} aria-hidden="true">+</span>
                  Create Task
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              disabled={loading}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
                padding: 'clamp(0.625rem, 2vw, 0.875rem) clamp(1rem, 4vw, 1.5rem)',
                fontWeight: '600',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                flex: '1 1 auto',
                minWidth: '100px',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1
              }}
              aria-label="Cancel and return to task list"
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
            <span aria-hidden="true">💡</span> Tips
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#1e40af', lineHeight: '1.6' }} role="list">
            <li>Be specific with your task title</li>
            <li>Set realistic due dates</li>
            <li>Mark high-priority tasks appropriately</li>
            <li>Add detailed descriptions for better clarity</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default AddTaskForm;