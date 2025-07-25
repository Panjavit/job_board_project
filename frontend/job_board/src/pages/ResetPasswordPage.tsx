import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useParams<{ token: string }>(); // ดึง token จาก URL
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage(response.data.message + ' กำลังนำท่านกลับไปหน้าเข้าสู่ระบบ...');
            setTimeout(() => {
                navigate('/auth/employee/login');
            }, 3000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full">
            <div className="flex w-full flex-col items-center justify-center bg-white p-4 lg:w-1/2">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-bold text-center">ตั้งรหัสผ่านใหม่</h1>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-600 block">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            />
                        </div>

                        {message && <p className="text-sm text-center text-green-600">{message}</p>}
                        {error && <p className="text-sm text-center text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer rounded-xl bg-teal-600 py-3 text-lg font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
                        </button>
                    </form>
                </div>
            </div>
             <div className="hidden h-full w-1/2 bg-black lg:inline-block">
                <img
                    src="/image/login-img.jpg" // คุณอาจจะต้องเปลี่ยน path รูปภาพให้ถูกต้อง
                    className="h-full w-full object-cover"
                    alt="Reset password"
                />
            </div>
        </main>
    );
};

export default ResetPasswordPage;