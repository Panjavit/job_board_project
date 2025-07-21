import React, { useEffect, useState, useRef } from 'react'; // 1. เพิ่ม useRef
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LineCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const effectRan = useRef(false); // 2. สร้าง ref flag ขึ้นมา

    useEffect(() => {
        // 3. เพิ่มเงื่อนไขตรวจสอบ flag เพื่อให้โค้ดทำงานแค่ครั้งเดียว
        if (effectRan.current === false) {
            const handleLineCallback = async () => {
                const code = searchParams.get('code');

                if (code) {
                    try {
                        const response = await api.post('/auth/line/callback', { code });
                        const { token } = response.data;
                        login(token);
                        navigate('/profile');
                    } catch (err) {
                        setError('การยืนยันตัวตนกับ LINE ล้มเหลว กรุณาลองอีกครั้ง');
                        setTimeout(() => navigate('/auth/employee/login'), 3000);
                    }
                } else {
                    setError('ไม่พบ Authorization code.');
                    setTimeout(() => navigate('/auth/employee/login'), 3000);
                }
            };

            handleLineCallback();
        }

        // 4. ตั้งค่าให้ flag เป็น true เมื่อ effect ทำงานเสร็จ
        return () => {
            effectRan.current = true;
        };
    }, [searchParams, navigate, login]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {error ? (
                <div className="text-center text-red-500">
                    <h1 className="text-2xl font-bold">การยืนยันตัวตนล้มเหลว</h1>
                    <p>{error}</p>
                    <p className="mt-4 text-sm text-gray-600">กำลังนำท่านกลับสู่หน้าล็อกอิน...</p>
                </div>
            ) : (
                <div className="text-center text-gray-700">
                    <h1 className="text-2xl font-bold">กำลังยืนยันตัวตนกับ LINE...</h1>
                    <p>กรุณารอสักครู่</p>
                </div>
            )}
        </div>
    );
};

export default LineCallbackPage;