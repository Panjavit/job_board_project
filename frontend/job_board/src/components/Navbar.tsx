import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { pathname } = useLocation();

    return (
        <div className=" bg-[#00a991] ">
        <nav className="container  mx-auto max-w-[1800px] relative h-auto p-10 flex flex-col md:flex-row md:justify-between md:items-center md:h-[150px]">
            <img
                src="/ideatrade.svg"
                alt="ideatrade logo"
                className="h-31 w-41 mr-4 pr-4"
            />
            <div className=" flex flex-col my-5 md:flex-row mr-68 pr-68 font-semibold text-xl  ">
                <Link
                    to={'/'}
                    className={`text-white p-12 hover:text-black hover:underline transition-all ${pathname === '/' && 'after:scale-100'}`}
                >
                    ค้นหานักศึกษาฝึกงาน
                </Link>
                <Link
                    to={'/profile'}
                    className={`text-white p-12 hover:text-black hover:underline transition-all ${pathname === '/profile' && 'after:scale-100'}`}
                >
                    โปรไฟล์
                </Link>
                <Link
                    to={'/about'}
                    className={`text-white p-12 hover:text-black hover:underline transition-all ${pathname === '/about' && 'after:scale-100'}`}
                >
                    เกี่ยวกับเรา
                </Link>
            </div>
            <div className=" flex flex-col my-5 md:flex-row">
               <div className="my-2 md:mx-5"> 
                <Link
                    to={'/auth/employee/login'}
                    className="text-xl  py-3 px-6 bg-white rounded-full hover:bg-black hover:text-white transform transition-all"
                >
                    เข้าสู่ระบบ
                </Link>
                </div>
                <div className="my-2 md:mx-5">
                <Link
                    to={'/auth/employee/register'}
                    className="text-white text-xl py-3 px-6 bg-black rounded-full hover:bg-white hover:text-black transform transition-all"
                >
                    บริษัทเข้าสู่ระบบ
                </Link>
               </div>
            </div>
        </nav>
        </div>
    );
};

export default Navbar;
