import type { Dispatch, SetStateAction } from 'react';

interface CardType {
    studentId: string;
    studentCode: string;
    position: string;
    period: string;
    type: string;
    education: string;
    department: string;
    skill: string[];
    createdAt: string;
    profileImageUrl: string | null;
    setShowPopup: Dispatch<SetStateAction<boolean>>;
}

const Card = ({
    studentId,
    studentCode,
    position,
    period,
    type,
    education,
    department,
    skill,
    createdAt,
    profileImageUrl,
    setShowPopup,
}: CardType) => {
    return (
        
        <div className="bg-[#f0f4f4] flex flex-col h-full cursor-pointer rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex w-full items-center justify-between text-sm">
                <p>กำลังมองหางาน</p>
                <p>{createdAt}</p>
            </div>
            <div className="mt-4 flex h-fit w-full gap-8">
                <div className="flex-shrink-0 bg-gray-200 w-14 h-14 flex items-center justify-center rounded-full text-2xl overflow-hidden">
                    {profileImageUrl ? (
                        //ถ้ามีURLของรูปภาพ ให้แสดงแท็ก <img>
                        <img
                            src={`http://localhost:5001${profileImageUrl}`}
                            alt={studentCode}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // ถ้าไม่มีให้แสดงไอคอนรูปยิ้ม
                        <i className="fa-regular fa-face-smile text-gray-500"></i>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p>{studentCode}</p>
                    <p className="font-bold">{position}</p>
                </div>
            </div>
            <ul className="mt-4 flex grow flex-col items-center justify-between gap-4">
                <li className="flex w-full">
                    <p className="w-1/3">ช่วงฝึกงาน</p>
                    <p>{period}</p>
                </li>
                <li className="flex w-full">
                    <p className="w-1/3">รูปแบบ</p>
                    <p>{type}</p>
                </li>
                <li className="flex w-full">
                    <p className="w-1/3">ระดับการศึกษา</p>
                    <p>{education}</p>
                </li>
                <li className="flex w-full">
                    <p className="w-1/3">สาขาวิชา</p>
                    <p>{department}</p>
                </li>
                <li className="flex w-full">
                    <p className="w-1/3">สกิลที่มี</p>
                    <p>
                        {skill.map((s, index) => (
                            <span
                                key={index}
                                className="after:content-[','] last:after:content-['']"
                            >
                                {' '}
                                {s}
                            </span>
                        ))}
                    </p>
                </li>
            </ul>
        </div>
    );
};

export default Card;
