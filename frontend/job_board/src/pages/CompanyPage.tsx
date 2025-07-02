// frontend/job_board/src/pages/CompanyPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Edit3, Phone, Mail, Globe, User } from 'lucide-react';

// Interface สำหรับข้อมูลนักศึกษาที่ดึงมาจาก API
interface InterestedStudentInteraction {
    id: string;
    student: {
        id: string;
        fullName: string;
        desiredPosition: string | null;
        major: string | null;
        profileImageUrl: string | null;
        internshipApplications: { universityName: string }[];
    };
}

// ข้อมูลบริษัททั้งหมดจะถูกเก็บไว้ที่นี่
const companyInfo = {
    name: 'บริษัทหลักทรัพย์ พาย จำกัด (มหาชน)',
    nameEn: 'Pi Securities Public Company Limited',
    address: [
        '132 อาคารสินธร ทาวเวอร์ 3 ชั้น 18',
        'ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน',
        'กรุงเทพมหานคร 10330',
    ],
    logo: 'pi',
};

const contactInfo = {
    name: 'ญาณิสา แผ่รุ่งเรือง',
    nameEn: 'Yanisa Phaerunggrueang',
    position: 'ผู้ช่วยกรรมการผู้จัดการ',
    department: 'ฝ่ายกำหนดทรัพย์ A3/1',
    phones: ['02 205 7041', '064 494 7456'],
    email: 'yanisa.ph@pi.financial',
    website: 'www.pi.financial',
};

const CompanyPage: React.FC = () => {
    // State จะมีไว้สำหรับเก็บข้อมูลนักศึกษาและสถานะการโหลดเท่านั้น
    const [interestedStudents, setInterestedStudents] = useState<
        InterestedStudentInteraction[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ฟังก์ชันนี้จะดึงข้อมูลเฉพาะนักศึกษาที่สนใจ
        const fetchInterestedStudents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(
                    '/profiles/company/me/interested-students'
                );
                setInterestedStudents(response.data);
            } catch (error) {
                console.error('Failed to fetch interested students:', error);
                // กรณีดึงข้อมูลไม่สำเร็จ ให้แสดงเป็นลิสต์ว่างแทน
                setInterestedStudents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterestedStudents();
    }, []);

    // ส่วนแสดงผลทั้งหมดจะใช้ข้อมูลจากตัวแปรที่เตรียมไว้
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="h-[200px] rounded-3xl bg-gradient-to-r from-teal-500 to-teal-800 p-6 text-white">
                <div className="flex w-full items-center justify-between">
                    <div className="ml-55 flex items-center gap-4">
                        <div className="mr-8 flex h-24 w-24 items-center justify-center rounded-lg bg-teal-400 text-xl font-bold text-white">
                            {companyInfo.logo}
                        </div>
                        <div>
                            <h1 className="mb-1 text-2xl leading-tight font-bold">
                                {companyInfo.name}
                            </h1>
                            <div className="space-y-0.5 text-xl text-teal-100">
                                <p>{contactInfo.name}</p>
                                <p>{contactInfo.position}</p>
                                <p>{contactInfo.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-medium text-teal-700">
                            <Edit3 className="h-4 w-4" /> แก้ไขข้อมูลบริษัท
                        </button>
                        <button className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white">
                            คุณกำลังล็อกอินในบัญชีบริษัทอยู่
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-6 max-w-7xl">
                <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            ข้อมูลของเรา
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <h3 className="mb-1 text-base font-medium text-teal-600">
                                    {contactInfo.name}
                                </h3>
                                <h4 className="mb-2 text-base font-medium text-teal-600">
                                    {contactInfo.nameEn}
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-700">
                                    {contactInfo.position}
                                    <br />
                                    {contactInfo.department}
                                </p>
                            </div>
                            <div className="space-y-2">
                                {contactInfo.phones.map((phone, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {phone}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {contactInfo.email}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="mb-2 text-base font-medium text-teal-600">
                                    {companyInfo.nameEn}
                                </h4>
                                <div className="space-y-1 text-sm leading-relaxed text-gray-700">
                                    {companyInfo.address.map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-gray-500" />
                                <a
                                    href={`https://${contactInfo.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                                >
                                    {contactInfo.website}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-800">
                                รายชื่อบุคคลที่สนใจ
                            </h2>
                            <span className="ml-auto text-sm text-gray-500">
                                ({interestedStudents.length} คน)
                            </span>
                        </div>
                        {isLoading ? (
                            <p>กำลังโหลดรายชื่อ...</p>
                        ) : (
                            <div className="space-y-4">
                                {interestedStudents.map(({ id, student }) => (
                                    <div
                                        key={id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:border-teal-200"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-800">
                                                    ชื่อ:
                                                </span>
                                                <span className="ml-2 text-gray-700">
                                                    {student.fullName}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-800">
                                                    ตำแหน่ง:
                                                </span>
                                                <span className="ml-2 text-teal-600">
                                                    {student.desiredPosition ||
                                                        'ไม่ระบุ'}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-800">
                                                    มหาวิทยาลัย:
                                                </span>
                                                <span className="ml-2 text-gray-500">
                                                    {student
                                                        .internshipApplications[0]
                                                        ?.universityName ||
                                                        'ไม่ระบุ'}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-800">
                                                    สาขาวิชา:
                                                </span>
                                                <span className="ml-2 text-gray-500">
                                                    {student.major || 'ไม่ระบุ'}
                                                </span>
                                            </p>
                                        </div>
                                        <Link
                                            to={`/students/${student.id}`}
                                            className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                                        >
                                            ดูโปรไฟล์
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;
