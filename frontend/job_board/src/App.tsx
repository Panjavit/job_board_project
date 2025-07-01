import { useState , useEffect} from 'react';
import Card from './components/Card';
import FilterSection from './components/FilterSection';
import { Filter } from "lucide-react";
import api from './services/api';
import { useAuth } from './context/AuthContext';

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
}

//ระบบเปลี่ยนหน้า
function App() {
  const [showPop, setShowPop] = useState(false);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
 
  useEffect(() => {
    const fetchStudents = async () => {
      // ตรวจสอบว่าผู้ใช้เป็น COMPANY และล็อกอินอยู่หรือไม่
      if (isAuthenticated && user?.role === 'COMPANY') {
        setIsLoading(true);
        try {
          const response = await api.get('/students');
          setStudents(response.data.data); // ข้อมูลอยู่ใน response.data.data
        } catch (error) {
          console.error("Failed to fetch students:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        // ถ้าไม่ใช่บริษัท อาจจะแสดงข้อความว่า "เฉพาะบริษัทเท่านั้นที่ดูหน้านี้ได้"
      }
    };

    fetchStudents();
  }, [isAuthenticated, user]);

    return (
    <div className="w-full">
      <FilterSection />
      <section className="w-full p-16">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-black ml-9">
              นักศึกษาหาที่ฝึกงาน
            </h2>
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md border-2 mr-9">
              <Filter className="w-4 h-4" />
              <select className="bg-black text-white focus:outline-none">
                <option>เรียงลำดับตาม : ทั้งหมด</option>
                <option>เรียงลำดับตาม : ล่าสุด</option>
                <option>เรียงลำดับตาม : ยอดนิยม</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* แสดงสถานะการโหลด */}
        {isLoading && <p className="text-center mt-8">กำลังโหลดข้อมูลนักศึกษา...</p>}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {!isLoading && students.map((student) => {
            const application = student.internshipApplications?.[0];
            const period = application 
              ? `${new Date(application.startDate).toLocaleDateString('th-TH')} - ${new Date(application.endDate).toLocaleDateString('th-TH')}`
              : 'ไม่ระบุ';
            
            return (
              <Card 
                key={student.id} 
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
            )
          })}
        </div>
        {/* คุณอาจจะต้องปรับแก้ส่วน Pagination ให้ทำงานกับข้อมูลจาก API ต่อไป */}
      </section>
    </div>
  );
}

export default App;