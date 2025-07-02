import { useState, useEffect } from 'react';
import Card from './components/Card';
import FilterSection from './components/FilterSection';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { Filter } from 'lucide-react';

interface StudentProfile {
    id: string;
    studentCode: string;
    fullName: string;
    desiredPosition: string | null;
    internshipApplications: {
        internshipType: string;
        startDate: string;
        endDate: string;
    }[];
    education: string | null;
    studyYear: number | null;
    major: string | null;
    skills: { skill: { name: string } }[];
    updatedAt: string;
    profileImageUrl: string | null;
}

const getInternshipTypeText = (type: string) => {
    switch (type) {
        case 'FULL_TIME':
            return 'พนักงานประจำ';
        case 'PART_TIME':
            return 'พาร์ทไทม์';
        case 'INTERNSHIP':
            return 'ฝึกงาน';
        default:
            return 'ไม่ระบุ';
    }
};

function App() {
    const [showPop, setShowPop] = useState(false);
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        position: '',
        studyYear: '',
        internshipType: '',
    });
    const { isAuthenticated, user } = useAuth();
    
    // 1. สร้างฟังก์ชันสำหรับดึงข้อมูล (แยกออกมาเพื่อให้เรียกใช้ซ้ำได้)
    const fetchStudents = async () => {
        if (isAuthenticated && user?.role === 'COMPANY' || user?.role === 'CANDIDATE') {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (filters.position) params.append('position', filters.position);
            if (filters.studyYear) params.append('studyYear', filters.studyYear);
            // เพิ่มการส่ง internshipType ไปกับ query ด้วย
            if (filters.internshipType) params.append('internshipType', filters.internshipType);
            
            try {
                const response = await api.get(`/students?${params.toString()}`);
                setStudents(response.data.data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    // 2. useEffect นี้จะทำงานแค่ครั้งเดียวตอนโหลดหน้าเว็บ เพื่อดึงข้อมูลเริ่มต้น
    useEffect(() => {
        fetchStudents();
    }, [isAuthenticated, user]); // เอา filters ออกจาก dependency array

    // 3. สร้างฟังก์ชันสำหรับส่งให้ปุ่ม "ค้นหา" เรียกใช้
    const handleSearch = () => {
        fetchStudents(); // เรียกฟังก์ชันดึงข้อมูลด้วยค่า filters ปัจจุบัน
    };

    return (
        <div className="w-full">
            {/* 4. ส่งฟังก์ชัน onSearch ไปให้ FilterSection */}
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
                            <select className="bg-black text-white focus:outline-none">
                                <option>เรียงลำดับตาม : ทั้งหมด</option>
                                <option>เรียงลำดับตาม : ล่าสุด</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <p className="mt-8 text-center">กำลังค้นหา...</p>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {students.length > 0 ? (
                            students.map(student => {
                                const application = student.internshipApplications?.[0];
                                const period = application
                                    ? `${new Date(application.startDate).toLocaleDateString('th-TH')} - ${new Date(application.endDate).toLocaleDateString('th-TH')}`
                                    : 'ไม่ระบุ';

                                return (
                                    <Card
                                        key={student.id}
                                        userRole={user?.role}
                                        studentId={student.id}
                                        studentCode={student.studentCode || 'รอดำเนินการ'}
                                        position={student.desiredPosition || 'ไม่ระบุตำแหน่ง'}
                                        period={period}
                                        type={getInternshipTypeText(application?.internshipType)}
                                        education={`ปริญญาตรี ปี ${student.studyYear || '-'}`}
                                        department={student.major || 'ไม่ระบุ'}
                                        skill={student.skills.map(s => s.skill.name)}
                                        createdAt={new Date(student.updatedAt).toLocaleDateString('th-TH')}
                                        profileImageUrl={student.profileImageUrl}
                                        setShowPopup={setShowPop}
                                    />
                                );
                            })
                        ) : (
                             <p className="col-span-full text-center text-gray-500 mt-8">ไม่พบนักศึกษาตามเงื่อนไขที่ค้นหา</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default App;
