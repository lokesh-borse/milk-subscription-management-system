import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './FormTextarea.css';

/**
 * FormTextarea Component
 * Reusable form textarea with validation states and character count
 * Features:
 * - Required indicator (*)
 * - Error message display
 * - Character count display
 * - Focus state with blue ring shadow
 * - Hint text support
 * - Disabled state
 * - Auto-resize capability
 * - Smooth transitions
 */
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  hint,
  placeholder,
  maxLength,
  rows = 4,
  className = '',
  ...props
}) => {
  const isError = !!error;
  const showSuccess = success && !isError;
  const characterCount = value ? value.length : 0;

  return (
    <div className={`form-textarea-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="textarea-wrapper">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`form-textarea ${isError ? 'error' : ''} ${
            showSuccess ? 'success' : ''
          }`}
          aria-invalid={isError}
          aria-describedby={isError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          {...props}
        />

        {/* Success Icon */}
        {showSuccess && !disabled && (
          <div className="textarea-icon success-icon">
            <CheckCircle2 size={18} />
          </div>
        )}

        {/* Error Icon */}
        {isError && !disabled && (
          <div className="textarea-icon error-icon">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      {/* Character Count and Error/Hint */}
      <div className="textarea-footer">
        <div className="textarea-messages">
          {isError && (
            <p id={`${name}-error`} className="form-error">
              {error}
            </p>
          )}
          {hint && !isError && (
            <p id={`${name}-hint`} className="form-hint">
              {hint}
            </p>
          )}
        </div>

        {maxLength && (
          <span className={`character-count ${
            characterCount > maxLength * 0.8 ? 'warning' : ''
          }`}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormTextarea;
