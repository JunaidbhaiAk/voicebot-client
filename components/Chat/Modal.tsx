"use client";

import { CONTEXT_SUMMARY } from "@/lib/constant";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contextSummary = CONTEXT_SUMMARY;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Context for Junaid’s Bot</h2>
        <div
          className="text-gray-700 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: contextSummary.replace(/\n/g, "<br />"),
          }}
        />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
