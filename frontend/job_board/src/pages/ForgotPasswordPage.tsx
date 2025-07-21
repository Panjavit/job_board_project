import React, { useState } from "react";
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('หากอีเมลของคุณมีอยู่ในระบบ คุณจะได้รับลิงก์สำหรับรีเซ็ตรหัสผ่าน');
        } catch (err: any) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <main className="flex h-screen w-full">
            <div className="flex w-full flex-col items-center justify-center bg-white p-4 lg:w-1/2">
                <Link to="/" className="absolute top-8 left-8">
                    <img src={'/logo-2.png'} alt="logo" className="h-[140px] w-[140px]" />
                </Link>
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-bold text-center">ลืมรหัสผ่าน</h1>
                    <p className="mt-2 text-center text-gray-600">
                        กรุณากรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">อีเมล</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg bg-stone-200 py-3 px-4"
                                placeholder="อีเมลของคุณ"
                            />
                        </div>

                        {message && <p className="text-sm text-center text-green-600">{message}</p>}
                        {error && <p className="text-sm text-center text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer rounded-xl bg-teal-600 py-3 text-lg font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
                        >
                            {isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/auth/employee/login" className="text-sm font-semibold text-gray-600 hover:text-teal-600 hover:underline">
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden h-full w-1/2 bg-black lg:inline-block">
                <img
                    src="/image/login-img.jpg" // คุณอาจจะต้องเปลี่ยน path รูปภาพให้ถูกต้อง
                    className="h-full w-full object-cover"
                    alt="Forgot password"
                />
            </div>
        </main>
    );
};

export default ForgotPasswordPage;