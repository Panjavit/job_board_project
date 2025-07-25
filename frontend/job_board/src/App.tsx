import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './components/Card';
import FilterSection from './components/FilterSection';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { Filter } from 'lucide-react';
import LoginAlertModal from './components/LoginAlertModal';
import toast from 'react-hot-toast';

// 1. อัปเดต Interface ให้ตรงกับโครงสร้างข้อมูลใหม่
interface StudentProfile {
    id: string;
    studentCode: string | null;
    fullName: string;
    desiredPosition: string | null;
    studyYear: number | null;
    major: string | null;
    skills: { skill: { name: string } }[];
    updatedAt: string;
    profileImageUrl: string | null;
    internshipType: string | null;
    startDate: string | null;
    endDate: string | null;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
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
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            const params = new URLSearchParams();
            
            if (filters.position) params.append('position', filters.position);
            if (filters.studyYear) params.append('studyYear', filters.studyYear);
            if (filters.internshipType) params.append('internshipType', filters.internshipType);
            params.append('sort', sortBy);
            params.append('page', currentPage.toString());
            // params.append('limit', '12'); //แสดง 12 คนต่อหน้า

            try {
                const response = await api.get(`/students?${params.toString()}`);
                setStudents(response.data.data || []);
                setPaginationInfo(response.data.pagination || null);
            } catch (error) {
                console.error("Failed to fetch students:", error);
                setStudents([]);
                setPaginationInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [sortBy, searchTrigger, currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTrigger(prev => prev + 1);
    };

    const handleCardClick = (studentId: string) => {
        if (isAuthenticated) {
            if (user?.role === 'COMPANY') {
                navigate(`/students/${studentId}`);
            } else {
                toast.error('ฟีเจอร์นี้สำหรับผู้ใช้งานประเภทบริษัทเท่านั้น');
            }
        } else {
            setIsModalOpen(true);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
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
                    <>
                        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {students.length > 0 ? (
                                students.map(student => (
                                    <Card
                                        key={student.id}
                                        student={student} // 2. ส่ง student ไปตรงๆ ได้เลย
                                        onCardClick={() => handleCardClick(student.id)}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full mt-8 text-center text-gray-500">
                                    ไม่พบนักศึกษาตามเงื่อนไขที่ค้นหา
                                </p>
                            )}
                        </div>
                        
                        {paginationInfo && paginationInfo.totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50"
                                >
                                    ก่อนหน้า
                                </button>
                                
                                {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-md border ${
                                            currentPage === page
                                                ? 'bg-teal-500 text-white border-teal-500'
                                                : 'bg-white border-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === paginationInfo.totalPages}
                                    className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50"
                                >
                                    ถัดไป
                                </button>
                            </div>
                        )}
                    </>
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