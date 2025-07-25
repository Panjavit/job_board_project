import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginAlertModal: React.FC<LoginAlertModalProps> = ({
    isOpen,
    onClose,
}) => {
    const navigate = useNavigate();

    // ถ้า state isOpen เป็น false, ไม่ต้องแสดงอะไรเลย
    if (!isOpen) return null;

    const handleLoginRedirect = () => {
        onClose(); // ปิด Modal ก่อน
        navigate('/auth/employee/login'); // แล้วค่อยไปที่หน้า Login
    };

    return (
        // ส่วนพื้นหลังสีดำโปร่งแสง ที่ครอบทั้งหน้าจอ
        <div
            className="fixed inset-0 z-50 flex items-center justify-center" // ลบ bg-black และ bg-opacity-40 ออก
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} // เพิ่ม style เข้าไปแทน
            onClick={onClose}
        >
            {/* ส่วนกล่องข้อความสีขาวตรงกลาง */}
            <div
                className="animate-fade-in-up relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
                onClick={e => e.stopPropagation()} // ป้องกันไม่ให้ Modal ปิดเมื่อคลิกที่ตัวกล่องข้อความ
            >
                {/* ปุ่มปิด (X) ที่มุมขวาบน */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* ไอคอนวงกลมสีแดง */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <X className="h-8 w-8 text-red-500" strokeWidth={3} />
                </div>

                {/* ข้อความหลัก */}
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    คุณยังไม่ได้เข้าสู่ระบบ
                </h2>
                <p className="mb-6 text-gray-600">
                    กรุณาเข้าสู่ระบบเพื่อใช้งานเว็บไซต์นี้
                </p>

                {/* ปุ่ม "เข้าสู่ระบบ" */}
                <button
                    onClick={handleLoginRedirect}
                    className="w-full rounded-lg bg-teal-600 px-4 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-teal-700"
                >
                    เข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
};

export default LoginAlertModal;
