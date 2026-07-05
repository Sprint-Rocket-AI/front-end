import React from 'react';

type ToastType = 'success' | 'error' | 'info' | 'custom';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message?: string;
  duration?: number;
  render?: (id: string) => React.ReactNode;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastEmitter {
  private toasts: ToastMessage[] = [];
  private listeners: Set<ToastListener> = new Set();

  getToasts() {
    return this.toasts;
  }

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(type: ToastType, message?: string, options?: { duration?: number; render?: (id: string) => React.ReactNode }) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options?.duration ?? 4000;

    const newToast: ToastMessage = {
      id,
      type,
      message,
      duration,
      render: options?.render,
    };

    this.toasts.push(newToast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  success(message: string, duration?: number) {
    return this.add('success', message, { duration });
  }

  error(message: string, duration?: number) {
    return this.add('error', message, { duration });
  }

  info(message: string, duration?: number) {
    return this.add('info', message, { duration });
  }

  custom(render: (id: string) => React.ReactNode, options?: { duration?: number }) {
    return this.add('custom', undefined, { render, duration: options?.duration });
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  dismiss(id: string) {
    this.remove(id);
  }
}

export const toast = new ToastEmitter();
export default toast;
