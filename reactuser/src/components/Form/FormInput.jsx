import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import './FormInput.css';

/**
 * FormInput Component
 * Reusable form input with validation states, icons, and password visibility toggle
 * Features:
 * - Required indicator (*)
 * - Error message display
 * - Success/Error state styling
 * - Password visibility toggle
 * - Focus state with blue ring shadow
 * - Hint text support
 * - Disabled state
 * - Smooth transitions
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  hint,
  className = '',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const displayType = type === 'password' && isPasswordVisible ? 'text' : type;
  const isError = !!error;
  const showSuccess = success && !isError;

  return (
    <div className={`form-input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={displayType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-input ${isError ? 'error' : ''} ${
            showSuccess ? 'success' : ''
          } ${type === 'password' ? 'has-password-toggle' : ''}`}
          aria-invalid={isError}
          aria-describedby={isError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          {...props}
        />

        {/* Password Visibility Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Success Icon */}
        {showSuccess && !disabled && (
          <div className="input-icon success-icon">
            <CheckCircle2 size={18} />
          </div>
        )}

        {/* Error Icon */}
        {isError && !disabled && (
          <div className="input-icon error-icon">
            <AlertCircle size={18} />
          </div>
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

export default FormInput;
