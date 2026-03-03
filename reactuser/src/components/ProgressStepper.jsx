import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import './ProgressStepper.css';

/**
 * ProgressStepper Component
 * Visual indicator for multi-step processes
 * Features:
 * - Numbered steps in circles
 * - Current step highlighting
 * - Completed steps with checkmark
 * - Connection lines between steps
 * - Step labels
 * - Responsive design (vertical on mobile, horizontal on desktop)
 */
const ProgressStepper = ({
  currentStep = 1,
  steps = [],
  orientation = 'horizontal',
  size = 'medium',
}) => {
  const stepSize = {
    small: 32,
    medium: 40,
    large: 48,
  };

  const stepDimension = stepSize[size];

  return (
    <div className={`progress-stepper ${orientation}`}>
      <div className="stepper-wrapper">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

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
                  <CheckCircle2 size={stepDimension - 4} />
                ) : (
                  <Circle size={stepDimension - 4} />
                )}
                {!isCompleted && (
                  <span className="step-number">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="step-label">
                <p className="label-text">{step.label}</p>
                {step.description && (
                  <p className="label-description">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar (alternative compact view) */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill"></div>
      </div>
    </div>
  );
};

export default ProgressStepper;
