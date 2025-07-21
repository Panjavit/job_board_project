import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ErrorModal from '../components/ErrorModal';

interface UserPayload {
    id: string;
    profileId: string;
    role: 'CANDIDATE' | 'COMPANY' | 'ADMIN';
}

const EmployeeLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); //สำหรับเปลี่ยนหน้า
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const { login: appLogin } = useAuth();
    const [newUser, setNewUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); //ป้องกันไม่ให้หน้าเว็บรีโหลด
        setError(''); //ล้าง error เก่า

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            //localStorage.setItem('token',token);
            login(token);
            const decodedToken: { user: UserPayload } = jwtDecode(token);
            const userRole = decodedToken.user.role;
            if (userRole === 'COMPANY') {
                navigate('/company-profile');
            } else if (userRole === 'CANDIDATE') {
                navigate('/profile');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'เกิดข้อผิดพลาดในการล็อกอิน';
            setError(errorMessage);
            setIsModalOpen(true);
            console.error('Login failed:', err);
        }
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code', //สำคัญมาก! ต้องใช้ Flow นี้เพื่อให้ได้ Authorization Code
        onSuccess: async codeResponse => {
            setError('');
            try {
                // ส่ง 'code' ไปที่ Backend
                const response = await api.post('/auth/google', {
                    code: codeResponse.code,
                });

                // รับ Token ของแอปเรากลับมาแล้วล็อกอิน
                const { token } = response.data;
                appLogin(token); // appLogin คือ login จาก useAuth()

                // นำทางไปยังหน้าโปรไฟล์
                navigate('/profile');
            } catch (error) {
                console.error('Google auth failed:', error);
                setError('การยืนยันตัวตนกับ Google ล้มเหลว');
            }
        },
        onError: () => setError('ไม่สามารถล็อกอินด้วย Google ได้'),
    });
    const handleLineLogin = () => {
        //สร้าง state token แบบสุ่มเพื่อป้องกัน CSRF
        const state = Math.random().toString(36).substring(2);
        sessionStorage.setItem('line_login_state', state);

        const lineLoginUrl = new URL(
            'https://access.line.me/oauth2/v2.1/authorize'
        );
        lineLoginUrl.searchParams.append('response_type', 'code');
        lineLoginUrl.searchParams.append('client_id', '2007686516');
        lineLoginUrl.searchParams.append(
            'redirect_uri',
            'http://localhost:5173/auth/line/callback'
        );
        lineLoginUrl.searchParams.append('state', state);
        lineLoginUrl.searchParams.append('scope', 'profile openid email');

        //นำทางผู้ใช้ไปยังหน้า LINE Login
        window.location.href = lineLoginUrl.toString();
    };

    return (
        <main className="flex h-screen w-full">
            <section className="flex w-full min-w-[300px] flex-col items-center justify-center bg-white p-4 lg:w-1/2">
                <Link to={'/'} className="absolute top-8 left-8">
                    <img
                        src={'/logo-2.png'}
                        alt="login-ideatrade"
                        className="h-[140px] w-[140px]"
                    />
                </Link>
                <h1 className="text-4xl font-bold">เข้าสู่ระบบ</h1>
                {/* <p className="mt-2 text-lg font-bold">สำหรับผู้หางาน</p> */}
                <form
                    onSubmit={handleLogin}
                    //action=""
                    className="mt-8 flex w-full max-w-[400px] flex-col gap-8"
                >
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type="email"
                            placeholder="อีเมล"
                            value={email} //เพิ่ม value เพื่อให้ React สามารถควบคุมข้อมูลในฟอร์มได้อย่างสมบูรณ์
                            onChange={e => setEmail(e.target.value)} //เพิ่ม onChange
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-envelope absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="รหัสผ่าน"
                            value={password} //เพิ่ม value เพื่อให้ React สามารถควบคุมข้อมูลในฟอร์มได้อย่างสมบูรณ์
                            onChange={e => setPassword(e.target.value)} //เพิ่ม onChange
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-lock absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                        <button
                            type="button"
                            className="absolute top-1/2 right-4 flex h-full -translate-y-1/2 cursor-pointer items-center justify-center"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? (
                                <i className="fa-solid fa-eye text-lg text-red-500"></i>
                            ) : (
                                <i className="fa-solid fa-eye-slash text-lg"></i>
                            )}
                        </button>
                    </div>
                    <button
                        className="bg-dark hover:bg-dark-hover w-full cursor-pointer rounded-xl py-4 text-xl font-bold text-white transition-all hover:scale-[102%]"
                        type="submit"
                    >
                        เข้าสู่ระบบ
                    </button>
                </form>
                <button
                    onClick={handleLineLogin}
                    type="button"
                    className="mt-10 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]"
                >
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white">
                        <i className="fa-brands fa-line text-4xl text-green-500"></i>
                    </div>
                    เข้าสู่ระบบด้วย LINE
                </button>
                <button
                    onClick={() => googleLogin()}
                    type="button"
                    className="mt-4 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]"
                >
                    <i className="fa-brands fa-google text-3xl text-red-500"></i>
                    เข้าสู่ระบบด้วย GOOGLE
                </button>
                <div className="mt-12 text-center text-sm">
                    <Link
                        to="/forgot-password"
                        className="font-semibold text-teal-600 hover:underline"
                    >
                        ลืมรหัสผ่าน?
                    </Link>
                    <p className="mt-2 text-gray-500">
                        ยังไม่มีบัญชี ?{' '}
                        <Link
                            to={'/auth/employee/register'}
                            className="font-semibold text-teal-600 hover:underline"
                        >
                            ลงทะเบียน
                        </Link>
                    </p>
                </div>
            </section>
            <section className="hidden h-full w-1/2 bg-black lg:inline-block">
                <img
                    src="/public/image/login-img.jpg"
                    className="h-full w-full object-cover object-top-left"
                />
            </section>
            <ErrorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="เกิดข้อผิดพลาด"
                message={error}
            />
        </main>
    );
};

export default EmployeeLoginPage;
