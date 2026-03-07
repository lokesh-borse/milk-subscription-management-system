import React from 'react';
import { Check } from 'lucide-react';
import './ProgressStepper.css';

/**
 * ProgressStepper Component - Premium Organic Farm Aesthetic
 * Visual indicator for multi-step processes
 * Features:
 * - Large glowing success circles when completed
 * - Smooth animated progress bar
 * - Mobile-responsive "Step X of 8" view
 * - Premium typography and shadows
 */
const ProgressStepper = ({
  currentStep = 1,
  steps = [],
  orientation = 'horizontal',
  size = 'large',
}) => {
  const stepSize = {
    small: 36,
    medium: 44,
    large: 52,
  };

  const stepDimension = stepSize[size];
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={`progress-stepper ${orientation}`}>
      {/* Mobile Step Indicator */}
      <div className="mobile-step-indicator">
        <span className="step-badge">
          Step {currentStep} of {steps.length}
        </span>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--stepper-text-muted)' }}>
          {steps[currentStep - 1]?.label}
        </p>
      </div>

      {/* Desktop Stepper */}
      <div className="stepper-wrapper">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.id || index} className="step-item-wrapper">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={`step-connector ${
                    isCompleted ? 'completed' : 'pending'
                  }`}
                >
                  <div className="connector-line"></div>
                </div>
              )}

              {/* Step Circle */}
              <div
                className={`step-circle ${
                  isActive ? 'active' : isCompleted ? 'completed' : 'pending'
                }`}
                style={{
                  width: stepDimension,
                  height: stepDimension,
                  minWidth: stepDimension,
                  minHeight: stepDimension,
                }}
              >
                {isCompleted ? (
                  <Check size={stepDimension * 0.5} strokeWidth={3} />
                ) : (
                  <span className="step-number">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="step-label">
                <p className="label-text">{step.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressStepper;
