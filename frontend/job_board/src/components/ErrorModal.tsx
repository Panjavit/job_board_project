import React from 'react';
import { X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={onClose}
        >
            <div
                className="animate-fade-in-up relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <X className="h-8 w-8 text-red-500" strokeWidth={3} />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    {title}
                </h2>
                <p className="mb-6 text-gray-600">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-teal-600 px-4 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-teal-700"
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;