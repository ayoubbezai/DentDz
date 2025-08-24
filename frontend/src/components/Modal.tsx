"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export interface ModalProps {
  isAddModalOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({
  isAddModalOpen,
  closeModal,
  children,
  title,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isAddModalOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
      // Small delay to allow DOM update before triggering transition
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = "unset";

      setIsVisible(false);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddModalOpen]);

  
  return (
    <>
      {isAddModalOpen && (
        <div
          className={`fixed inset-0 
  bg-[rgba(156,163,175,0.4)]   /* Tailwind gray-400 with 40% opacity */
  transition-opacity duration-300 z-40
  ${isVisible ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div
        className={`fixed top-1/2 right-3 -translate-y-1/2 h-[93vh] rounded-2xl w-[400px] max-w-1/3 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
            ${isVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-3 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            {}
            <X className="h-4 w-4 text-neutral-800" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
