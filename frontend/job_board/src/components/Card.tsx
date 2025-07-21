// frontend/job_board/src/components/Card.tsx

import React from 'react';

// 1. ปรับแก้ Interface ให้รับข้อมูลเป็นก้อน และรับฟังก์ชัน onCardClick
interface StudentData {
    id: string;
    studentCode: string | null;
    fullName: string;
    desiredPosition: string | null;
    major: string | null;
    profileImageUrl: string | null;
    updatedAt: string;
    studyYear: number | null;
    skills: { skill: { name: string } }[];
    internshipApplications: {
        internshipType: string;
        startDate: string;
        endDate: string;
    }[];
}

interface CardProps {
  student: StudentData;
  onCardClick: (studentId: string) => void;
}

const getInternshipTypeText = (type: string | undefined) => {
    switch (type) {
        case 'FULL_TIME': return 'พนักงานประจำ';
        case 'PART_TIME': return 'พาร์ทไทม์';
        case 'INTERNSHIP': return 'ฝึกงาน';
        default: return 'ไม่ระบุ';
    }
};

const Card: React.FC<CardProps> = ({ student, onCardClick }) => {
    
    const application = student.internshipApplications?.[0];
    const period = application 
        ? `${new Date(application.startDate).toLocaleDateString('th-TH')} - ${new Date(application.endDate).toLocaleDateString('th-TH')}`
        : 'ไม่ระบุ';

    // 2. เปลี่ยนจากการใช้ <Link> มาเป็น <div> ที่มี onClick
    return (
        <div 
            onClick={() => onCardClick(student.id)} 
            className="flex h-full flex-col cursor-pointer"
        >
            <div className="flex h-full flex-col rounded-xl bg-[#f0f4f4] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex w-full items-center justify-between text-sm text-gray-500">
                    <p>กำลังมองหางาน</p>
                    <p>{new Date(student.updatedAt).toLocaleDateString('th-TH')}</p>
                </div>
                <div className="mt-4 flex h-fit w-full items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl">
                        {student.profileImageUrl ? (
                            <img
                                src={`http://localhost:5001${student.profileImageUrl}`}
                                alt={student.studentCode || ''}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <i className="fa-regular fa-face-smile text-gray-500"></i>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-600">{student.studentCode || 'N/A'}</p>
                        <p className="font-bold text-gray-800">{student.desiredPosition || 'ไม่ระบุตำแหน่ง'}</p>
                    </div>
                </div>
                <ul className="mt-4 flex grow flex-col space-y-2 text-sm">
                    <li><span className="font-semibold w-24 inline-block">ช่วงฝึกงาน:</span> {period}</li>
                    <li><span className="font-semibold w-24 inline-block">รูปแบบ:</span> {getInternshipTypeText(application?.internshipType)}</li>
                    <li><span className="font-semibold w-24 inline-block">ระดับการศึกษา:</span> {`ปริญญาตรี ปี ${student.studyYear || '-'}`}</li>
                    <li><span className="font-semibold w-24 inline-block">สาขาวิชา:</span> {student.major || 'ไม่ระบุ'}</li>
                    <li className="flex"><span className="font-semibold w-24 inline-block shrink-0">สกิลที่มี:</span><p className="truncate">{student.skills.map(s => s.skill.name).join(', ') || 'ไม่มี'}</p></li>
                </ul>
            </div>
        </div>
    );
};

export default Card;