// LoginAlertModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const LoginAlertModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Alert Content */}
        <div className="text-center mb-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          
          {/* Alert Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            คุณยังไม่ได้เข้าสู่ระบบ
          </h2>
          <p className="text-gray-600 text-sm">
            กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดตำแหน่งงาน
          </p>
        </div>
        
        {/* Login Button */}
        <button
          onClick={onLogin}
          className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors font-medium"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

export default LoginAlertModal;