import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

const Sidebar = ({
    children,
    openSidebar,
    setOpenSidebar,
}: {
    children: React.ReactNode;
    openSidebar: boolean;
    setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // ส่วนนี้สำคัญที่สุด
    useEffect(() => {
        if (!openSidebar) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setOpenSidebar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openSidebar, setOpenSidebar]); // Dependencies ต้องมี openSidebar และ setOpenSidebar

    return (
        <div
            className={`fixed top-0 right-0 z-50 flex h-screen w-full max-w-2xl flex-col gap-4 bg-white p-8 shadow-2xl ${
                openSidebar ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
            ref={sidebarRef}
        >
            <button
                onClick={() => setOpenSidebar(false)}
                type="button"
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            >
                <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {children}
        </div>
    );
};

export default Sidebar;