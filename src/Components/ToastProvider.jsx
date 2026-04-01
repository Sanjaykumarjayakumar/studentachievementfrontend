import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import './ToastProvider.css';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef({});

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const value = useMemo(
    () => ({
      toast: {
        error: (message, duration) => addToast(message, 'error', duration),
        success: (message, duration) => addToast(message, 'success', duration),
        info: (message, duration) => addToast(message, 'info', duration),
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-message toast-${toast.type}`}
            role="alert"
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
