import { writable } from "svelte/store";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  autoDestroy?: boolean;
}

function createToastStore() {
  const { subscribe, update } = writable<ToastData[]>([]);

  return {
    subscribe,
    add: (toast: Omit<ToastData, "id">) => {
      const id = crypto.randomUUID();
      update((toasts) => [...toasts, { id, ...toast }]);
      return id;
    },
    remove: (id: string) => {
      update((toasts) => toasts.filter((t) => t.id !== id));
    },
    clear: () => {
      update(() => []);
    },
  };
}

export const toasts = createToastStore();

// Convenience functions
export function showToast(message: string, type: ToastData["type"] = "info", duration = 3000) {
  return toasts.add({ message, type, duration });
}

export function showSuccess(message: string, duration = 3000) {
  return toasts.add({ message, type: "success", duration });
}

export function showError(message: string, duration = 5000) {
  return toasts.add({ message, type: "error", duration });
}
