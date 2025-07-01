import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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
    const {login} = useAuth();
    const { login: appLogin } = useAuth();
    const [newUser, setNewUser] = useState<any | null>(null);

    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault(); //ป้องกันไม่ให้หน้าเว็บรีโหลด
        setError(''); //ล้าง error เก่า

        try {
            const response = await api.post('/auth/login', {email, password});
            const {token} = response.data;
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
            const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการล็อกอิน';
            setError(errorMessage);
            console.error("Login failed:", err)
        }
    }

    const googleLogin = useGoogleLogin({
      flow: 'auth-code', // สำคัญมาก! ต้องใช้ Flow นี้เพื่อให้ได้ Authorization Code
      onSuccess: async (codeResponse) => {
        setError('');
        try {
          // ส่ง 'code' ที่ได้จาก Google ไปที่ Backend API ตัวแรก (/google/callback)
          const response = await api.post('/auth/google/callback', {
            code: codeResponse.code,
          });

          if (response.data.isNewUser) {
            // ถ้าเป็นผู้ใช้ใหม่: เก็บข้อมูลไว้ใน state เพื่อแสดงหน้าเลือก Role
            setNewUser(response.data.googleProfile);
          } else {
            // ถ้าเป็นผู้ใช้เก่า: ล็อกอินได้เลย
            appLogin(response.data.token);
            alert('Google Login สำเร็จ!');
            navigate('/profile');
          }
        } catch (error) {
          console.error("Google auth failed:", error);
          setError('การยืนยันตัวตนกับ Google ล้มเหลว');
        }
      },
      onError: () => setError('ไม่สามารถล็อกอินด้วย Google ได้'),
    });
    

    return (
        <main className="flex h-screen w-full">
            <section className="flex lg:w-1/2 w-full flex-col items-center justify-center bg-white p-4 min-w-[300px]">
                <Link to={'/'} className="absolute top-8 left-8" >
                    <img src={'/logo-2.png'} alt="login-ideatrade" className="w-[140px] h-[140px]" />
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
                            onChange={(e) => setEmail(e.target.value)} //เพิ่ม onChange
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-envelope absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="รหัสผ่าน"
                            value={password} //เพิ่ม value เพื่อให้ React สามารถควบคุมข้อมูลในฟอร์มได้อย่างสมบูรณ์
                            onChange={(e) => setPassword(e.target.value)} //เพิ่ม onChange
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
                <button className="mt-10 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]">
                    <div className="h-[30px] w-[30px] rounded-lg bg-white">
                        <i className="fa-brands fa-line text-4xl text-green-500"></i>
                    </div>
                    เข้าสู่ระบบด้วย LINE
                </button>
                <button 
                    onClick={() => googleLogin()} 
                    type = "button"
                    className="mt-4 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]">
                    <i className="fa-brands fa-google text-3xl text-red-500"></i>
                    เข้าสู่ระบบด้วย GOOGLE
                </button>
                <p className="mt-12">
                    ยังไม่มีบัญชี ?{' '}
                    <Link
                        to={'/auth/employee/register'}
                        className="text-dark cursor-pointer underline"
                    >
                        ลงทะเบียน
                    </Link>
                </p>
            </section>
            <section className="h-full w-1/2 bg-black hidden lg:inline-block">
                <img
                    src="/public/image/login-img.jpg"
                    className="h-full w-full object-cover object-top-left"
                />
            </section>
        </main>
    );
};

export default EmployeeLoginPage;
