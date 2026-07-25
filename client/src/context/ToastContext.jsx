import React, { createContext, useState, useContext } from 'react';
import ToastNotification from '../components/common/ToastNotification';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastNotification toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
