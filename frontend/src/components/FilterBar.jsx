import React, { useState, useEffect } from 'react';

const FilterBar = ({ tasks, onFilter }) => {
  const [filterType, setFilterType] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applyFilters = (tasksList, type, priority, search) => {
    let filtered = tasksList;

    if (type === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (type === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (priority !== 'all') {
      filtered = filtered.filter(task => task.priority === priority);
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  };

  const handleFilterChange = (type, priority, search) => {
    setFilterType(type);
    setPriorityFilter(priority);
    setSearchTerm(search);

    const filtered = applyFilters(tasks, type, priority, search);
    onFilter(filtered);
  };

  useEffect(() => {
    const filtered = applyFilters(tasks, filterType, priorityFilter, searchTerm);
    onFilter(filtered);
  }, [tasks]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    handleFilterChange(newType, priorityFilter, searchTerm);
  };

  const handlePriorityChange = (e) => {
    const newPriority = e.target.value;
    handleFilterChange(filterType, newPriority, searchTerm);
  };

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    handleFilterChange(filterType, priorityFilter, newSearch);
  };

  const handleReset = () => {
    setFilterType('all');
    setPriorityFilter('all');
    setSearchTerm('');
    onFilter(tasks);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const hasActiveFilters = filterType !== 'all' || priorityFilter !== 'all' || searchTerm.trim();

  return (
    <div 
      className="filter-bar animate-slide-up"
      role="search"
      aria-label="Filter and search tasks"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <label htmlFor="task-search" className="sr-only">Search tasks</label>
          <span style={{ position: 'absolute', left: '0.875rem', fontSize: '1rem', pointerEvents: 'none', color: '#6b7280' }} aria-hidden="true">🔍</span>
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: 'clamp(0.875rem, 3vw, 1rem)', borderRadius: '0.5rem', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }}
            aria-label="Search tasks"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearch({ target: { value: '' } })}
              style={{ position: 'absolute', right: '0.75rem', backgroundColor: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.125rem', padding: '0.25rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', width: '1.5rem', height: '1.5rem' }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          {/* Status Filter */}
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">
              Status
            </label>
            <select
              id="status-filter"
              value={filterType}
              onChange={handleTypeChange}
              className="filter-select"
              aria-label="Filter by task status"
            >
              <option value="all">📋 All Tasks</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <label htmlFor="priority-filter" className="filter-label">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={handlePriorityChange}
              className="filter-select"
              aria-label="Filter by task priority"
            >
              <option value="all">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            style={{
              padding: '0.625rem 1rem',
              fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
              fontWeight: '600',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              whiteSpace: 'nowrap',
              height: 'fit-content',
              opacity: hasActiveFilters ? 1 : 0.5
            }}
            aria-label="Reset all filters"
            aria-disabled={!hasActiveFilters}
          >
            <span aria-hidden="true">🔄</span>
            Reset
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 0, backgroundColor: '#f0f9ff', borderRadius: '0.5rem', padding: 0, border: '1px solid #bfdbfe', overflow: 'hidden' }} role="status" aria-live="polite">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', textAlign: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.125rem' }} aria-hidden="true">📊</span>
          <span style={{ fontSize: '0.8125rem', color: '#1e40af', fontWeight: '500' }}>
            Total: <strong>{tasks.length}</strong>
          </span>
        </div>
        <div style={{ width: '1px', height: '2rem', backgroundColor: '#bfdbfe', margin: '0' }} aria-hidden="true"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', textAlign: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.125rem' }} aria-hidden="true">⏳</span>
          <span style={{ fontSize: '0.8125rem', color: '#1e40af', fontWeight: '500' }}>
            Pending: <strong>{pendingCount}</strong>
          </span>
        </div>
        <div style={{ width: '1px', height: '2rem', backgroundColor: '#bfdbfe', margin: '0' }} aria-hidden="true"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', textAlign: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.125rem' }} aria-hidden="true">✅</span>
          <span style={{ fontSize: '0.8125rem', color: '#1e40af', fontWeight: '500' }}>
            Completed: <strong>{completedCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;