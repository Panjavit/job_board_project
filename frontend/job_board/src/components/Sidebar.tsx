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

    useEffect(() => {
        const closeSidebar = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setOpenSidebar(false);
            }
        };
        document.addEventListener('mousedown', closeSidebar);
        return () => document.removeEventListener('mousedown', closeSidebar);
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 z-100 flex h-screen w-[700px] flex-col gap-4 bg-white p-12 shadow-2xl ${openSidebar ? 'translate-x-0' : 'translate-x-full'} transition-all duration-300`}
            ref={sidebarRef}
        >
            <button
                onClick={() => {
                    setOpenSidebar(false);
                }}
                type="button"
                className="absolute top-12 right-12 aspect-square h-8 cursor-pointer text-xl text-red-500 transition-all hover:scale-110"
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
            {children}
        </div>
    );
};

export default Sidebar;