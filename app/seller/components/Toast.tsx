"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow CSS transition to happen
    requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      <span className="font-medium text-sm">{message}</span>
      <button 
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
