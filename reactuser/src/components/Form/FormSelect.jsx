import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import './FormSelect.css';

/**
 * FormSelect Component
 * Reusable form select with validation states and custom styling
 * Features:
 * - Required indicator (*)
 * - Error message display
 * - Custom styling with chevron icon
 * - Focus state with blue ring shadow
 * - Hint text support
 * - Disabled state
 * - Smooth transitions
 */
const FormSelect = ({
  label,
  name,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  hint,
  placeholder,
  className = '',
  ...props
}) => {
  const isError = !!error;

  return (
    <div className={`form-select-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-select ${isError ? 'error' : ''}`}
          aria-invalid={isError}
          aria-describedby={isError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="select-icon" size={18} />

        {/* Error Icon */}
        {isError && !disabled && (
          <AlertCircle className="input-error-icon" size={18} />
        )}
      </div>

      {/* Error Message */}
      {isError && (
        <p id={`${name}-error`} className="form-error">
          {error}
        </p>
      )}

      {/* Hint Text */}
      {hint && !isError && (
        <p id={`${name}-hint`} className="form-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
