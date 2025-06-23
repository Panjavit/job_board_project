import { useState } from 'react';
import Card from './components/Card';
import FilterSection from './components/FilterSection';
import { Filter } from "lucide-react";
interface CardType {
  id: string;
  position: string;
  period: string;
  type: string;
  education: string;
  department: string;
  skill: string[];
  createdAt: string;
}

const applications: CardType[] = [
    {
        id: 'Dev001',
        position: 'Developer',
        period: '25 เม.ย. 2568 - 25 ก.ค. 2568',
        type: 'part time',
        education: 'ปริญญาตรี',
        department: 'วิศวะกรรมคอมพิวเตอร์',
        skill: ['python', 'Java', 'HTML', 'CSS'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev002',
        position: 'Frontend Developer',
        period: '1 มิ.ย. 2568 - 1 ก.ย. 2568',
        type: 'internship',
        education: 'ปริญญาตรี',
        department: 'เทคโนโลยีสารสนเทศ',
        skill: ['React', 'JavaScript', 'CSS'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev003',
        position: 'Backend Developer',
        period: '15 พ.ค. 2568 - 15 ส.ค. 2568',
        type: 'full time',
        education: 'ปริญญาตรี',
        department: 'วิทยาการคอมพิวเตอร์',
        skill: ['Node.js', 'Express', 'MongoDB'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev004',
        position: 'Mobile Developer',
        period: '10 ก.ค. 2568 - 10 ต.ค. 2568',
        type: 'part time',
        education: 'ปริญญาตรี',
        department: 'วิศวกรรมซอฟต์แวร์',
        skill: ['Flutter', 'Dart'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev005',
        position: 'Data Analyst',
        period: '1 ส.ค. 2568 - 1 พ.ย. 2568',
        type: 'internship',
        education: 'ปริญญาโท',
        department: 'สถิติ',
        skill: ['Python', 'Excel', 'SQL'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev006',
        position: 'AI Engineer',
        period: '5 มิ.ย. 2568 - 5 ก.ย. 2568',
        type: 'full time',
        education: 'ปริญญาโท',
        department: 'วิศวกรรมคอมพิวเตอร์',
        skill: ['Python', 'TensorFlow', 'Keras'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev007',
        position: 'UI/UX Designer',
        period: '15 ก.ค. 2568 - 15 ต.ค. 2568',
        type: 'part time',
        education: 'ปริญญาตรี',
        department: 'ศิลปกรรม',
        skill: ['Figma', 'Adobe XD'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev008',
        position: 'QA Engineer',
        period: '20 เม.ย. 2568 - 20 ก.ค. 2568',
        type: 'internship',
        education: 'ปริญญาตรี',
        department: 'วิศวกรรมซอฟต์แวร์',
        skill: ['Selenium', 'JMeter'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev009',
        position: 'DevOps Engineer',
        period: '1 พ.ค. 2568 - 1 ส.ค. 2568',
        type: 'full time',
        education: 'ปริญญาตรี',
        department: 'วิศวกรรมคอมพิวเตอร์',
        skill: ['Docker', 'Kubernetes', 'AWS'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev010',
        position: 'System Analyst',
        period: '10 มิ.ย. 2568 - 10 ก.ย. 2568',
        type: 'part time',
        education: 'ปริญญาโท',
        department: 'เทคโนโลยีสารสนเทศ',
        skill: ['UML', 'SQL', 'Communication'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev011',
        position: 'Full Stack Developer',
        period: '1 ก.ค. 2568 - 1 ต.ค. 2568',
        type: 'full time',
        education: 'ปริญญาตรี',
        department: 'วิทยาการคอมพิวเตอร์',
        skill: ['React', 'Node.js', 'MongoDB'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev012',
        position: 'Game Developer',
        period: '25 เม.ย. 2568 - 25 ก.ค. 2568',
        type: 'internship',
        education: 'ปริญญาตรี',
        department: 'วิศวกรรมซอฟต์แวร์',
        skill: ['Unity', 'C#', 'Blender'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev013',
        position: 'Security Engineer',
        period: '1 มิ.ย. 2568 - 1 ก.ย. 2568',
        type: 'part time',
        education: 'ปริญญาโท',
        department: 'ความมั่นคงไซเบอร์',
        skill: ['Penetration Testing', 'Wireshark'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev014',
        position: 'Cloud Engineer',
        period: '15 พ.ค. 2568 - 15 ส.ค. 2568',
        type: 'full time',
        education: 'ปริญญาตรี',
        department: 'เทคโนโลยีสารสนเทศ',
        skill: ['AWS', 'Azure', 'GCP'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev015',
        position: 'Technical Writer',
        period: '10 ก.ค. 2568 - 10 ต.ค. 2568',
        type: 'internship',
        education: 'ปริญญาตรี',
        department: 'อักษรศาสตร์',
        skill: ['Markdown', 'Git', 'Technical English'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev016',
        position: 'Database Administrator',
        period: '1 ส.ค. 2568 - 1 พ.ย. 2568',
        type: 'full time',
        education: 'ปริญญาโท',
        department: 'ระบบสารสนเทศ',
        skill: ['MySQL', 'PostgreSQL', 'Backup'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev017',
        position: 'IT Support',
        period: '5 มิ.ย. 2568 - 5 ก.ย. 2568',
        type: 'part time',
        education: 'ปวส.',
        department: 'คอมพิวเตอร์ธุรกิจ',
        skill: ['Hardware', 'Troubleshooting', 'Networking'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev018',
        position: 'Blockchain Developer',
        period: '15 ก.ค. 2568 - 15 ต.ค. 2568',
        type: 'internship',
        education: 'ปริญญาโท',
        department: 'วิศวกรรมซอฟต์แวร์',
        skill: ['Solidity', 'Web3.js', 'Ethereum'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev019',
        position: 'Machine Learning Engineer',
        period: '20 เม.ย. 2568 - 20 ก.ค. 2568',
        type: 'full time',
        education: 'ปริญญาเอก',
        department: 'วิทยาศาสตร์ข้อมูล',
        skill: ['scikit-learn', 'pandas', 'NumPy'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev020',
        position: 'Scrum Master',
        period: '1 พ.ค. 2568 - 1 ส.ค. 2568',
        type: 'part time',
        education: 'ปริญญาโท',
        department: 'การจัดการเทคโนโลยี',
        skill: ['Agile', 'Jira', 'Facilitation'],
        createdAt: '10 นาทีผ่านไป',
    },
    {
        id: 'Dev021',
        position: 'Network Engineer',
        period: '10 มิ.ย. 2568 - 10 ก.ย. 2568',
        type: 'full time',
        education: 'ปริญญาตรี',
        department: 'วิศวกรรมโทรคมนาคม',
        skill: ['Cisco', 'Routing', 'Switching'],
        createdAt: '10 นาทีผ่านไป',
    },
];


//ระบบเปลี่ยนหน้า
function App() {
  const [showPop, setShowPop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
 
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll กลับบนสุดเมื่อเปลี่ยนหน้า
  };

  const currentItems = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1 , 2 , 3 , 4 , 5 ,  '...');
        } else if (currentPage >= totalPages - 2) {
          pages.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
        }
      }

      return pages;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-20 mb-20 pt-20 tb-20 ">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
            disabled={typeof page !== 'number'}
            className={` w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#00a991] text-black'
                : typeof page === 'number'
                ? 'bg-gray-100 text-black hover:bg-gray-200'
                : 'text-gray-400 cursor-default'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

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
        
        <div className="mt-8 flex w-full flex-wrap items-stretch justify-center gap-8 [&>div:nth-child(3n+1)_.third]:bg-black [&>div:nth-child(3n+2)_.third]:bg-orange-600 [&>div:nth-child(3n+3)_.third]:bg-blue-400">
          {currentItems.map((app) => (
            <Card key={app.id} {...app} setShowPopup={setShowPop} />
          ))}
        </div>
        {/* ✅ แสดง Pagination */}
        <Pagination />   
      </section>
    </div>
    
  );
}

export default App;