import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import LoginAlertModal from './LoginAlertModal';

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = () => {
        logout();
        navigate('/auth/employee/login');
    };

    const handleProfileClick = () => {
        if (isAuthenticated) {
            const profilePath =
                user?.role === 'COMPANY' ? '/company-profile' : '/profile';
            navigate(profilePath);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="bg-[#00a991]">
            <nav className="container mx-auto flex h-auto max-w-[1800px] flex-col items-center justify-between p-6 md:h-[100px] md:flex-row">
                {/* ส่วนโลโก้และเมนู (จัดชิดซ้าย) */}
                <div className="flex flex-col items-center md:flex-row">
                    <img
                        src="/ideatrade.svg"
                        alt="ideatrade logo"
                        className="h-12 w-auto"
                    />
                    <div className="my-4 flex flex-col items-center gap-4 text-lg font-bold md:my-0 md:ml-10 md:flex-row md:gap-8">
                        <Link
                            to={'/'}
                            className={`text-white transition-all hover:text-black hover:underline ${pathname === '/' && 'after:scale-100'}`}
                        >
                            ค้นหานักศึกษาฝึกงาน
                        </Link>
                        <button
                            type="button"
                            onClick={handleProfileClick}
                            className={`text-white transition-all hover:text-black hover:underline ${
                                (pathname === '/profile' ||
                                    pathname === '/company-profile') &&
                                'after:scale-100'
                            }`}
                        >
                            โปรไฟล์
                        </button>
                        <Link
                            to={'/about'}
                            className={`text-white transition-all hover:text-black hover:underline ${pathname === '/about' && 'after:scale-100'}`}
                        >
                            เกี่ยวกับเรา
                        </Link>
                    </div>
                </div>

                {/* ส่วนของผู้ใช้ (จัดชิดขวา) */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div
                            className="relative flex items-center gap-3"
                            ref={dropdownRef}
                        >
                            {/* แยกข้อความออกมา */}
                            <span className="font-semibold whitespace-nowrap text-white">
                                สวัสดี, {user?.name?.split(' ')[0]}
                            </span>

                            {/* ปุ่มฟันเฟือง */}
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-black/20"
                                aria-label="เมนูผู้ใช้"
                            >
                                <i className="fa-solid fa-gear text-lg"></i>
                            </button>

                            {/* เมนู Dropdown (เหมือนเดิม) */}
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                                    <Link
                                        to="/change-password"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        เปลี่ยนรหัสผ่าน
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to={'/auth/employee/login'}
                            className="transform rounded-full bg-white px-5 py-2 text-base transition-all hover:bg-black hover:text-white"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    )}
                </div>
            </nav>

            <LoginAlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Navbar;
