import type { Dispatch, SetStateAction } from 'react';

interface CardType {
    id: string;
    position: string;
    period: string;
    type: string;
    education: string;
    department: string;
    skill: string[];
    createdAt: string;
    setShowPopup: Dispatch<SetStateAction<boolean>>;
}

const Card = ({
    id,
    position,
    period,
    type,
    education,
    department,
    skill,
    createdAt,
    setShowPopup,
}: CardType) => {
    return (
        
        <div className="bg-[#f0f4f4] h-88 w-[30%] min-w-[500px] cursor-pointer rounded-xl p-8 shadow-xl transition-all duration-300 hover:scale-[102%]">
            <div className="flex w-full items-center justify-between text-sm">
                <p>กำลังมองหางาน</p>
                <p>{createdAt}</p>
            </div>
            <div className="mt-4 flex h-fit w-full gap-8">
                <div className="third flex aspect-square h-14 items-center justify-center rounded-full text-2xl text-white">
                    <i className="fa-regular fa-face-smile"></i>
                </div>
                <div className="flex flex-col gap-2">
                    <p>{id}</p>
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
