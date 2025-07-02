import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const profilePath =
        user?.role === 'COMPANY' ? '/company-profile' : '/profile';

    const handleLogout = () => {
        logout(); //เรียกฟังก์ชัน logout จาก AuthContext
        navigate('/auth/employee/login');
    };

    return (
        <div className="bg-[#00a991]">
            <nav className="relative container mx-auto flex h-auto max-w-[1800px] flex-col p-10 md:h-[150px] md:flex-row md:items-center md:justify-between">
                <img
                    src="/ideatrade.svg"
                    alt="ideatrade logo"
                    className="mr-4 h-31 w-41 pr-4"
                />
                <div className="my-5 mr-68 flex flex-col pr-68 text-xl font-semibold md:flex-row">
                    <Link
                        to={'/'}
                        className={`p-12 text-white transition-all hover:text-black hover:underline ${pathname === '/' && 'after:scale-100'}`}
                    >
                        ค้นหานักศึกษาฝึกงาน
                    </Link>
                    <Link
                        to={profilePath} // 4. ใช้ตัวแปร profilePath ที่สร้างขึ้น
                        className={`p-12 text-white transition-all hover:text-black hover:underline ${
                            (pathname === '/profile' ||
                                pathname === '/company-profile') &&
                            'after:scale-100'
                        }`}
                    >
                        โปรไฟล์
                    </Link>
                    <Link
                        to={'/about'}
                        className={`p-12 text-white transition-all hover:text-black hover:underline ${pathname === '/about' && 'after:scale-100'}`}
                    >
                        เกี่ยวกับเรา
                    </Link>
                </div>
                <div className="my-5 flex flex-col md:flex-row md:items-center md:gap-4">
                    {isAuthenticated ? (
                        <>
                            {/* เงื่อนไข: ถ้าเป็น Candidate ให้แสดงชื่อ */}
                            {user?.role === 'CANDIDATE' && (
                                <span className="font-semibold text-white">
                                    {/* ดึงเฉพาะชื่อแรกมาแสดง */}
                                    สวัสดี, {user.name?.split(' ')[0]}
                                </span>
                            )}

                            {/* ปุ่มออกจากระบบ (เหมือนเดิม) */}
                            <div className="my-2 md:mx-0">
                                <button
                                    onClick={handleLogout}
                                    className="transform rounded-full bg-black px-6 py-3 text-xl text-white transition-all hover:bg-gray-800"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        </>
                    ) : (
                        //ถ้ายังไม่ล็อกอิน ให้แสดงปุ่ม Login ทั้งสอง
                        <>
                            <div className="my-2 md:mx-5">
                                <Link
                                    to={'/auth/employee/login'}
                                    className="transform rounded-full bg-white px-6 py-3 text-xl transition-all hover:bg-black hover:text-white"
                                >
                                    เข้าสู่ระบบ
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
