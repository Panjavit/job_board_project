import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './components/Card';
import FilterSection from './components/FilterSection';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { Filter } from 'lucide-react';
import LoginAlertModal from './components/LoginAlertModal';

// Interface นี้ควรจะตรงกับข้อมูลที่ Backend ส่งมาให้จริงๆ
interface StudentProfile {
    id: string;
    studentCode: string | null;
    fullName: string;
    desiredPosition: string | null;
    internshipApplications: {
        internshipType: string;
        startDate: string;
        endDate: string;
    }[];
    studyYear: number | null;
    major: string | null;
    skills: { skill: { name: string } }[];
    updatedAt: string;
    profileImageUrl: string | null;
}

function App() {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        position: '',
        studyYear: '',
        internshipType: '',
    });
    const [sortBy, setSortBy] = useState('desc');
    
    // State นี้จะใช้เป็น "ตัวกระตุ้น" ให้ useEffect ทำงานเมื่อมีการค้นหา
    const [searchTrigger, setSearchTrigger] = useState(0);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // useEffect นี้จะรับผิดชอบการดึงข้อมูลทั้งหมด
    // และจะทำงานเมื่อ:
    // 1. หน้าเว็บโหลดครั้งแรก
    // 2. ค่า sortBy เปลี่ยน (ผู้ใช้เลือก Dropdown)
    // 3. ค่า searchTrigger เปลี่ยน (ผู้ใช้กดปุ่มค้นหา)
    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            const params = new URLSearchParams();
            
            // นำค่าจาก filters และ sortBy มาสร้างเป็น query string
            if (filters.position) params.append('position', filters.position);
            if (filters.studyYear) params.append('studyYear', filters.studyYear);
            if (filters.internshipType) params.append('internshipType', filters.internshipType);
            params.append('sort', sortBy);

            try {
                const response = await api.get(`/students?${params.toString()}`);
                setStudents(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch students:", error);
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [sortBy, searchTrigger]); // 🔴 จุดสำคัญ: ให้ useEffect ทำงานเมื่อ 2 ค่านี้เปลี่ยน

    // ฟังก์ชันสำหรับส่งให้ปุ่ม "ค้นหา" ใน FilterSection
    const handleSearch = () => {
        setSearchTrigger(prev => prev + 1); // เปลี่ยนค่าเพื่อกระตุ้น useEffect
    };

    // ฟังก์ชันสำหรับจัดการการคลิกการ์ด
    const handleCardClick = (studentId: string) => {
    if (isAuthenticated) {
        if (user?.role === 'COMPANY') {
            // ถ้าเป็น COMPANY ให้ไปที่หน้าโปรไฟล์นักศึกษา
            navigate(`/students/${studentId}`);
        } else {
            // ถ้าเป็น role อื่น (เช่น CANDIDATE) ให้แจ้งเตือน
            alert('ฟีเจอร์นี้สำหรับผู้ใช้งานประเภทบริษัทเท่านั้น');
        }
    } else {
        setIsModalOpen(true);
    }
};

    return (
        <div className="w-full">
            <FilterSection
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
            />
            <section className="w-full p-16">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="ml-9 text-3xl font-bold text-black">
                            นักศึกษาหาที่ฝึกงาน
                        </h2>
                        <div className="mr-9 flex items-center gap-2 rounded-md border-2 bg-black px-4 py-2 text-white">
                            <Filter className="h-4 w-4" />
                            <select 
                                className="bg-black text-white focus:outline-none"
                                value={sortBy}
                                // เมื่อเปลี่ยนค่า ให้ setSortBy โดยตรง
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="desc">เรียงลำดับตาม : ล่าสุด</option>
                                <option value="asc">เรียงลำดับตาม : เก่าสุด</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <p className="mt-8 text-center">กำลังค้นหา...</p>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {students.length > 0 ? (
                            students.map(student => (
                                <Card
                                    key={student.id}
                                    student={student}
                                    onCardClick={() => handleCardClick(student.id)}
                                />
                            ))
                        ) : (
                            <p className="col-span-full mt-8 text-center text-gray-500">
                                ไม่พบนักศึกษาตามเงื่อนไขที่ค้นหา
                            </p>
                        )}
                    </div>
                )}
            </section>
            <LoginAlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default App;