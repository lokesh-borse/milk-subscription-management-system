import React, { useEffect, useState } from 'react';

let nextId = 1;

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { type = 'info', message = '' } = e.detail || {};
      const id = nextId++;
      setToasts(t => [{ id, type, message }, ...t]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <div className="toast-root" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
          <div className="toast-body">{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
