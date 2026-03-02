import React, { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=800&auto=format&fit=crop';

const Image = ({ src, alt = '', className = '', style = {}, fallback, ...props }) => {
  const [current, setCurrent] = useState(src || '');
  const fb = fallback || DEFAULT_FALLBACK;

  useEffect(() => setCurrent(src || ''), [src]);

  return (
    <img
      {...props}
      src={current || fb}
      alt={alt}
      className={className}
      style={style}
      loading={props.loading || 'lazy'}
      onError={(e) => {
        if (e?.target?.src === fb) return; // already fallback
        e.target.src = fb;
        setCurrent(fb);
      }}
    />
  );
};

export default Image;
