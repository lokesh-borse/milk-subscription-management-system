import React from 'react';
import './Skeleton.css';

/**
 * Skeleton Loading Component
 * Provides shimmer animation for loading states
 * Features:
 * - Customizable dimensions
 * - Circle variant for avatars
 * - Multiple skeletons support
 * - Smooth shimmer animation
 */
const Skeleton = ({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  count = 1,
  variant = 'rectangle',
  className = '',
}) => {
  const isCircle = variant === 'circle';
  
  const skeletonStyle = {
    width: isCircle ? height : width,
    height: height,
    borderRadius: isCircle ? '50%' : borderRadius,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${className}`}
          style={skeletonStyle}
        />
      ))}
    </>
  );
};

export default Skeleton;
