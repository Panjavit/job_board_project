import type { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

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
        <Link to={`/students/${studentId}`} className="flex h-full flex-col">
            <div className="flex h-full cursor-pointer flex-col rounded-xl bg-[#f0f4f4] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex w-full items-center justify-between text-sm">
                    <p>กำลังมองหางาน</p>
                    <p>{createdAt}</p>
                </div>
                <div className="mt-4 flex h-fit w-full gap-8">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl">
                        {profileImageUrl ? (
                            //ถ้ามีURLของรูปภาพ ให้แสดงแท็ก <img>
                            <img
                                src={`http://localhost:5001${profileImageUrl}`}
                                alt={studentCode}
                                className="h-full w-full object-cover"
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
        </Link>
    );
};

export default Card;
