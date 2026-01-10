import React, { useState } from 'react';
import Modal from './Modal';
import API from '../utils/axiosInstance';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [completed, setCompleted] = useState(task.completed);
  const [error, setError] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleToggleComplete = async () => {
    try {
      if (!task._id) {
        throw new Error('Task ID is missing');
      }

      const updatedTask = {
        ...task,
        completed: !completed
      };

      await API.put(`/tasks/${task._id}`, updatedTask);

      setCompleted(!completed);
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error toggling task completion:', err);
    }
  };

  const handleEdit = () => {
    try {
      if (!task._id) {
        throw new Error('Cannot edit: Task ID is missing');
      }
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
      console.error('Error editing task:', err);
    }
  };

  const handleDelete = async () => {
    try {
      if (!task._id) {
        throw new Error('Cannot delete: Task ID is missing');
      }

      await API.delete(`/tasks/${task._id}`);

      if (onTaskDelete) {
        onTaskDelete();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handleModalSave = async (taskId, formData) => {
    try {
      const response = await API.put(`/tasks/${taskId}`, formData);
      
      setCompleted(formData.completed);
      
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      
      return response.data;
    } catch (err) {
      console.error('Error saving task:', err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      high: { color: '#dc2626', bgColor: '#fee2e2', label: 'High', icon: '🔴' },
      medium: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Medium', icon: '🟡' },
      low: { color: '#10b981', bgColor: '#d1fae5', label: 'Low', icon: '🟢' }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const priority = getPriorityInfo(task.priority || 'medium');
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !completed;

  return (
    <>
      <article 
        className={`task-card ${isOverdue ? 'overdue' : ''} ${completed ? 'completed' : ''} animate-slide-up`}
        onMouseEnter={() => !isMobile && !isModalOpen && setShowActions(true)}
        onMouseLeave={() => !isMobile && !isModalOpen && setShowActions(false)}
        onClick={() => isMobile && !isModalOpen && setShowActions(!showActions)}
        role="article"
        aria-label={`Task: ${task.title}`}
        style={{ 
          position: 'relative', 
          borderLeft: isOverdue ? '4px solid #dc2626' : 'none', 
          backgroundColor: isOverdue ? '#fef2f2' : completed ? '#f9fafb' : '#ffffff',
          pointerEvents: isModalOpen ? 'none' : 'auto',
          opacity: isModalOpen ? 0.5 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            className="animate-slide-up"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.625rem', borderRadius: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8125rem', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="task-card-header">
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <input
              type="checkbox"
              checked={completed}
              onChange={handleToggleComplete}
              className="task-checkbox"
              aria-label={`Mark task "${task.title}" as ${completed ? 'incomplete' : 'complete'}`}
              id={`task-${task._id}`}
              style={{ width: '1.375rem', height: '1.375rem', cursor: 'pointer', accentColor: '#2563eb', flexShrink: 0, marginTop: '0.125rem' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <label htmlFor={`task-${task._id}`} style={{ cursor: 'pointer', display: 'block', margin: 0 }}>
                <h3 className="task-card-title" style={{
                  textDecoration: completed ? 'line-through' : 'none', 
                  opacity: completed ? 0.6 : 1
                }}>
                  {task.title || 'Untitled Task'}
                </h3>
              </label>
              <p className="task-card-description">{task.description || 'No description'}</p>
            </div>
          </div>
          <div 
            className={`task-priority task-priority-${priority.label.toLowerCase()}`}
            aria-label={`Priority: ${priority.label}`}
          >
            <span aria-hidden="true">{priority.icon}</span>
            <span>{priority.label}</span>
          </div>
        </div>

        <div className="task-card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="task-card-meta-item">
              <span aria-hidden="true">📅</span>
              <span className="task-card-meta-label">Due:</span>
              <span className="task-card-meta-value" style={{
                color: isOverdue ? '#dc2626' : '#1f2937'
              }}>
                {task.dueDate ? formatDate(task.dueDate) : 'No date'}
              </span>
            </div>
            <div className="task-card-meta-item">
              <span aria-hidden="true">✓</span>
              <span className="task-card-meta-label">Status:</span>
              <span className={`task-status task-status-${completed ? 'completed' : 'pending'}`}>
                {completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div 
          className="task-card-actions"
          style={{
            maxHeight: (showActions || isMobile) ? '100px' : '0', 
            opacity: (showActions || isMobile) ? 1 : 0,
            pointerEvents: (showActions || isMobile) ? 'auto' : 'none',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            padding: (showActions || isMobile) ? '0.75rem' : 0
          }}
          role="group"
          aria-label="Task actions"
        >
          <button 
            className="btn btn-success" 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <span aria-hidden="true">{completed ? '↶' : '✓'}</span>
            {completed ? 'Undo' : 'Complete'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            aria-label={`Edit task: ${task.title}`}
          >
            <span aria-hidden="true">✎</span>
            Edit
          </button>
          <button 
            className="btn btn-danger" 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            aria-label={`Delete task: ${task.title}`}
          >
            <span aria-hidden="true">🗑</span>
            Delete
          </button>
        </div>
      </article>

      <Modal
        isOpen={isModalOpen}
        task={task}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TaskCard;