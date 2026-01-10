import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from './TaskCard';
import FilterBar from './FilterBar';
import API from '../utils/axiosInstance';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/tasks');
      
      setTasks(response.data);
      setFilteredTasks(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <main 
        className="tasks-container"
        role="main"
        aria-label="Tasks loading"
      >
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
          <div 
            style={{ width: '3rem', height: '3rem', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}
            role="status"
            aria-label="Loading tasks"
          >
            <span className="sr-only">Loading your tasks...</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500', margin: 0 }}>Loading your tasks...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main 
        className="tasks-container"
        role="main"
        aria-label="Error loading tasks"
      >
        <div 
          style={{ backgroundColor: '#ffffff', border: '2px solid #fecaca', borderRadius: '1rem', padding: '2rem', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          role="alert"
          aria-live="assertive"
          className="animate-slide-up"
        >
          <div style={{ fontSize: '3rem' }} aria-hidden="true">⚠️</div>
          <h3 style={{ color: '#991b1b', margin: 0, fontSize: 'clamp(1.125rem, 5vw, 1.5rem)', fontWeight: '700' }}>Oops! Something went wrong</h3>
          <p style={{ color: '#7f1d1d', margin: 0, fontSize: '0.875rem', maxWidth: '400px' }}>{error}</p>
          <button 
            onClick={fetchTasks}
            style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)' }}
            aria-label="Retry loading tasks"
          >
            <span aria-hidden="true">🔄</span> Try Again
          </button>
        </div>
      </main>
    );
  }

  // Empty state UI
  if (!filteredTasks || filteredTasks.length === 0) {
    const isEmpty = tasks.length === 0;
    
    return (
      <main 
        className="tasks-container"
        role="main"
        aria-label={isEmpty ? "No tasks yet" : "No filtered tasks"}
      >
        <div className="tasks-header">
          <div>
            <h2 className="tasks-title">Your Tasks</h2>
            <span style={{ fontSize: '0.875rem' }} aria-live="polite">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>
        
        {!isEmpty && <FilterBar tasks={tasks} onFilter={setFilteredTasks} />}
        
        <div 
          className="no-tasks animate-scale-in"
        >
          <div className="no-tasks-icon" aria-hidden="true">
            {isEmpty ? '📋' : '🔍'}
          </div>
          <h2 className="no-tasks-title">
            {isEmpty ? 'No tasks yet!' : 'No tasks match your filters'}
          </h2>
          <p className="no-tasks-text">
            {isEmpty 
              ? 'Click "Add Task" to create your first task'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {isEmpty && (
            <Link 
              to="/add" 
              style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.9375rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
              aria-label="Add your first task"
            >
              <span aria-hidden="true">+</span>
              Create Your First Task
            </Link>
          )}
        </div>
      </main>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <main 
      className="tasks-container"
      role="main"
      aria-label="Task list"
    >
      <div className="tasks-header animate-slide-up">
        <div>
          <h2 className="tasks-title">Your Tasks</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
            {completedCount} completed • {pendingCount} pending
          </p>
        </div>
        <div className="stat-badge" aria-live="polite">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      
      <FilterBar tasks={tasks} onFilter={setFilteredTasks} />
      
      <div 
        className="tasks-list"
        role="list"
        aria-label="Task list"
      >
        {filteredTasks.map((task, index) => (
          <div 
            key={task._id}
            role="listitem"
            style={{ animationDelay: `${index * 0.05}s` }}
            className="animate-slide-up"
          >
            <TaskCard 
              task={task}
              onTaskUpdate={fetchTasks}
              onTaskDelete={fetchTasks}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default TaskList;