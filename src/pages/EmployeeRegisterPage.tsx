import { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeRegisterPage = () => {
    const [showPass, setShowPass] = useState(false);
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
                <p className="mt-2 text-lg font-bold">สำหรับผู้หางาน</p>
                <form
                    action=""
                    className="mt-8 flex w-full max-w-[400px] flex-col gap-8"
                >
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type="text"
                            placeholder="อีเมล"
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-envelope absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative h-fit w-full text-stone-500 placeholder:text-stone-500">
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="รหัสผ่าน"
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
                            type="password"
                            placeholder="ยืนยันรหัสผ่าน"
                            className="outline-dark w-full rounded-lg bg-stone-200 py-4 pl-16 outline-offset-4"
                        />
                        <i className="fa-solid fa-lock absolute top-1/2 left-5 -translate-y-1/2 text-xl"></i>
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
                <button className="mt-4 flex w-full max-w-[400px] cursor-pointer items-center gap-8 rounded-lg bg-stone-200 px-4 py-3 transition-all hover:scale-[102%]">
                    <i className="fa-brands fa-google text-3xl text-red-500"></i>
                    เข้าสู่ระบบด้วย GOOGLE
                </button>
                <p className="mt-12">
                    ยังไม่มีบัญชี ?{' '}
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
