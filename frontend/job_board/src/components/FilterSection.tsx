import React from 'react';
import { FaUser, FaGraduationCap, FaBriefcase, FaSearch } from 'react-icons/fa';

interface FilterSectionProps {
    filters: {
        position: string;
        studyYear: string;
        internshipType: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    onSearch: () => void; // รับฟังก์ชัน onSearch เข้ามา
}

const FilterSection: React.FC<FilterSectionProps> = ({
    filters,
    setFilters,
    onSearch, // รับ onSearch มาใช้งาน
}) => {
    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prevFilters: any) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // สร้างฟังก์ชันสำหรับจัดการการ submit ฟอร์ม
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีโหลด
        onSearch();         // เรียกฟังก์ชันค้นหาที่ส่งมาจาก App.tsx
    };

    return (
        <div
            className="relative container flex h-auto max-w-[9800px] flex-col bg-gradient-to-br from-[#2e2b45] to-[#3b265f] md:h-[360px] md:items-center md:justify-center"
            style={{
                backgroundImage: "url('/image/bg-search.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="scale-110 p-10 md:mr-10 md:scale-130 md:p-0 md:pr-15">
                <h1 className="mb-6 w-full max-w-4xl text-left text-3xl font-bold text-teal-400">
                    ค้นหางาน
                </h1>
                
                {/* ครอบ input ทั้งหมดด้วย <form> และใช้ onSubmit */}
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full max-w-4xl flex-wrap items-center gap-4 bg-transparent"
                >
                    {/* ตำแหน่งงาน */}
                    <div className="flex min-w-[320px] flex-grow items-center rounded bg-white px-4 py-2 shadow">
                        <FaUser className="mr-2 text-gray-400" />
                        <input
                            type="text"
                            name="position"
                            placeholder="ตำแหน่งงาน"
                            className="w-full outline-none"
                            value={filters.position}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* วุฒิการศึกษา */}
                    <div className="flex min-w-[200px] items-center rounded bg-white px-4 py-2 shadow">
                        <FaGraduationCap className="mr-2 text-gray-400" />
                        <select
                            name="studyYear"
                            className="w-full bg-white outline-none"
                            value={filters.studyYear}
                            onChange={handleFilterChange}
                        >
                            <option value="">วุฒิการศึกษา</option>
                            <option value="1">ปี 1</option>
                            <option value="2">ปี 2</option>
                            <option value="3">ปี 3</option>
                            <option value="4">ปี 4</option>
                        </select>
                    </div>

                    {/* ประเภทงาน */}
                    <div className="flex min-w-[200px] items-center rounded bg-white px-4 py-2 pr-5 shadow">
                        <FaBriefcase className="mr-2 text-gray-400" />
                        <select
                            name="internshipType"
                            className="w-full bg-white outline-none"
                            value={filters.internshipType}
                            onChange={handleFilterChange}
                        >
                            <option value="">ประเภทงาน</option>
                            <option value="INTERNSHIP">ฝึกงาน</option>
                            <option value="FULL_TIME">พนักงานประจำ</option>
                            <option value="PART_TIME">พาร์ทไทม์</option>
                        </select>
                    </div>

                    {/* เปลี่ยนปุ่มเป็น type="submit" */}
                    <button
                        type="submit"
                        className="flex items-center rounded bg-teal-500 px-6 py-2 text-white shadow hover:bg-teal-600"
                    >
                        ค้นหา <FaSearch className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FilterSection;
