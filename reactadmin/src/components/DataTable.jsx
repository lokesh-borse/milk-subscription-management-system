import React, { useState, useMemo } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import './DataTable.css';

/**
 * DataTable Component with Advanced Features
 * Features:
 * - Column sorting (click header)
 * - Global search/filtering
 * - Pagination (10 rows per page)
 * - Edit/Delete action buttons
 * - Responsive design with horizontal scroll on mobile
 * - Hover effects and professional styling
 * - Loading and empty states
 */
const DataTable = ({
  columns = [],
  data = [],
  onEdit = () => {},
  onDelete = () => {},
  isLoading = false,
  emptyMessage = 'No data available',
  actionColumnWidth = '120px',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.accessor];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const compareVal = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortConfig.direction === 'asc' ? compareVal : -compareVal;
      });
    }

    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown size={14} />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

  // Skeleton Rows for loading state
  const SkeletonRow = () => (
    <tr>
      {columns.map((col) => (
        <td key={col.accessor}>
          <div className="skeleton skeleton-text"></div>
        </td>
      ))}
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
    </tr>
  );

  return (
    <div className="data-table-container">
      {/* Search Bar */}
      <div className="data-table-header">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="table-info">
          {filteredData.length > 0 && (
            <span className="result-count">
              {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col.accessor)}
                  style={{ width: col.width || 'auto' }}
                  className={`sortable ${
                    col.sortable !== false ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="header-content">
                    <span>{col.Header}</span>
                    {col.sortable !== false && (
                      <span className="sort-icon">
                        {getSortIcon(col.accessor)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th style={{ width: actionColumnWidth }} className="actions-header">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow key={`skeleton-${idx}`} />
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="empty-state-cell"
                >
                  <div className="empty-state">
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              paginatedData.map((row, idx) => (
                <tr key={idx} className="data-row">
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      style={{ width: col.width || 'auto' }}
                    >
                      {col.Cell ? col.Cell(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(row)}
                        title="Edit"
                        aria-label="Edit row"
                      >
                        <Edit2 size={16} />
                        <span className="btn-label">Edit</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(row)}
                        title="Delete"
                        aria-label="Delete row"
                      >
                        <Trash2 size={16} />
                        <span className="btn-label">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && paginatedData.length > 0 && (
        <div className="data-table-footer">
          <div className="pagination-info">
            <span className="pagination-text">
              Page {currentPage} of {totalPages} ({filteredData.length} total)
            </span>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              ⟨⟨
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ⟨
            </button>
            <span className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) })
                .map((_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      className={`page-number ${
                        page === currentPage ? 'active' : ''
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              ⟩
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              ⟩⟩
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
