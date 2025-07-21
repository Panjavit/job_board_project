import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EmployeeRegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('CANDIDATE');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State สำหรับช่องยืนยันรหัสผ่าน
    const navigate = useNavigate();

    const handleRegister = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');

        if(password !== confirmPassword){
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        try {
            const registrationData = {
                name: name,
                email: email,
                password: password,
                role: role,
            };

            await api.post('/auth/register', registrationData);
            navigate('/auth/employee/login');

        }catch(err: any){
            const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน';
            setError(errorMessage);
            console.error("Registration failed:", err);
        }
    }

    return (
        <main className="flex h-screen w-full">
            <section className="relative w-1/2 bg-white lg:inline-block hidden">
                <img
                    src={'/public/image/register-img.jpg'}
                    alt="login background"
                    className="h-full w-full object-cover"
                />
            </section>
            <div className="flex lg:w-1/2 w-full flex-col items-center justify-center bg-white p-4 min-w-[300px]">
                  <Link to={'/'} className="absolute top-8 right-8" >
                    <img src={'/logo-2.png'} alt="login-ideatrade" className="w-[140px] h-[140px]" />
                  </Link>
                <h1 className="text-4xl font-bold">ลงทะเบียน</h1>
                {/* <p className="mt-2 text-lg font-bold">สำหรับผู้หางาน</p> */}
                <form
                    onSubmit={handleRegister}
                    
                    className="mt-8 flex w-full max-w-[400px] flex-col gap-8"
                >
                    <div className="space-y-3">
                        <label className="font-bold text-gray-700">คุณคือ:</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="CANDIDATE"
                                    checked={role === 'CANDIDATE'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="h-4 w-4"
                                />
                                ผู้สมัครงาน
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="COMPANY"
                                    checked={role === 'COMPANY'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="h-4 w-4"
                                />
                                บริษัท
                            </label>
                        </div>
                    </div>
                    <div className="relative h-fit w-full text-stone-500">
                        <input
                            type="text"
                            placeholder={role === 'CANDIDATE' ? 'ชื่อ - นามสกุล' : 'ชื่อบริษัท'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-lg bg-stone-200 py-4 pl-12"
                        />
                        <i className="fa-solid fa-user absolute top-1/2 left-4 -translate-y-1/2 text-xl"></i>
                    </div>

                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type="email"
                            placeholder="อีเมล"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required //หมายความว่า "จำเป็นต้องกรอก"
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-envelope absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="รหัสผ่าน"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type= {showConfirmPassword ? 'text' : 'password'}
                            placeholder="ยืนยันรหัสผ่าน"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-lock absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                        <button
                            type="button"
                            className="absolute top-1/2 right-4 flex h-full -translate-y-1/2 cursor-pointer items-center justify-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
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
                        ลงทะเบียน
                    </button>
                </form>
                <button className="mt-10 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]">
                    <div className="h-[30px] w-[30px] rounded-lg bg-white">
                        <i className="fa-brands fa-line text-4xl text-green-500"></i>
                    </div>
                    เข้าสู่ระบบด้วย LINE
                </button>
                <button className="mt-4 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]">
                    <i className="fa-brands fa-google text-3xl text-red-500"></i>
                    เข้าสู่ระบบด้วย GOOGLE
                </button>
                <p className="mt-12">
                    มีบัญชีอยู่แล้ว ? {' '}
                    <Link
                        to={'/auth/employee/login'}
                        className="text-dark cursor-pointer underline"
                    >
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default EmployeeRegisterPage;
