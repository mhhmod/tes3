import { useEffect } from "react";

export interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onHide: () => void;
}

export default function NotificationToast({ message, type = "info", isVisible, onHide }: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  const iconClass = {
    success: "fas fa-check-circle text-green-400",
    error: "fas fa-exclamation-circle text-red-400",
    info: "fas fa-info-circle text-blue-400",
  }[type];

  return (
    <div 
      className="fixed top-4 right-4 z-50 animate-slide-up"
      data-testid="notification-toast"
    >
      <div className="bg-grind-surface border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <i className={iconClass} data-testid="notification-icon"></i>
          <span data-testid="notification-message">{message}</span>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-white ml-4"
            data-testid="button-close-notification"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
