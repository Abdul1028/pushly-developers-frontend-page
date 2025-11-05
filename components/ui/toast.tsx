"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 shadow-lg">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
          <Check className="h-3 w-3 text-white" />
        </div>
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
}

