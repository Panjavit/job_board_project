import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Edit3, User, Mail, Phone, MapPin } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import CompanyInfoSide from '../components/CompanyInfoSide';
import ContactInfoSide from '../components/ContactInfoSide';
import Linkify from '../components/Linkify';
import CompanyRegistrationSide from '../components/CompanyRegistrationSide';
import VideoUploadCard from '../components/VideoUploadCard';
import CompanyVideoSide from '../components/CompanyVideoSide';

interface CompanyProfile {
    id: string;
    companyName: string;
    about: string | null;
    contactInstructions: string;
    user: { email: string };
    location: string | null;
    logoUrl: string | null;
    recruiterName: string | null;
    recruiterPosition: string | null;
    emails: { id: string; email: string }[];
    phones: { id: string; phone: string }[];
    additionalContactInfo: string | null;
    province: string | null;
    registrationNumber: string | null;
    legalName: string | null;
    companyType: string | null;
    businessTypeName: string | null;
    registeredCapital: number | null;
    videoUrl: string | null;
}
interface InterestedStudentInteraction {
    id: string;
    student: {
        id: string;
        fullName: string;
        desiredPosition: string | null;
        major: string | null;
        internshipApplications: { universityName: string }[];
    };
}

const CompanyPage: React.FC = () => {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [interestedStudents, setInterestedStudents] = useState<
        InterestedStudentInteraction[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);
    const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
    const [isRegistrationSidebarOpen, setIsRegistrationSidebarOpen] =
        useState(false);

    const [isVideoSidebarOpen, setIsVideoSidebarOpen] = useState(false);
    const fetchData = useCallback(async () => {
        try {
            const profilePromise = api.get('/profiles/company/me');
            const studentsPromise = api.get(
                '/profiles/company/me/interested-students'
            );
            const [profileResponse, studentsResponse] = await Promise.all([
                profilePromise,
                studentsPromise,
            ]);
            setProfile(profileResponse.data);
            setInterestedStudents(studentsResponse.data);
        } catch (error) {
            console.error('Failed to fetch company data:', error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [fetchData]);

    const handleInfoSidebarClose = useCallback(
        () => setIsInfoSidebarOpen(false),
        []
    );
    const handleContactSidebarClose = useCallback(
        () => setIsContactSidebarOpen(false),
        []
    );

    if (isLoading)
        return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
    if (!profile)
        return (
            <div className="p-10 text-center text-red-500">
                ไม่พบข้อมูลโปรไฟล์ กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง
            </div>
        );

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 font-sans">
                {/* Header */}
                <div
                    className="h-auto rounded-xl bg-cover bg-center p-6 text-white md:h-[200px]"
                    style={{ backgroundImage: "url('/image/bg-comp.png')" }}
                >
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-x-6">
                            {' '}
                            <label
                                htmlFor="logo-upload"
                                className="group relative h-38 w-40 flex-shrink-0 cursor-pointer"
                            >
                                {' '}
                                {profile.logoUrl ? (
                                    <img
                                        src={`http://localhost:5001${profile.logoUrl}`}
                                        alt={profile.companyName}
                                        className="h-full w-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-teal-400 text-2xl font-bold text-white uppercase">
                                        {profile.companyName.substring(0, 2)}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <i className="fa-solid fa-camera text-xl text-white"></i>
                                </div>
                            </label>
                            <input
                                id="logo-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        try {
                                            await api.post(
                                                '/profiles/company/me/logo',
                                                formData
                                            );
                                            alert('อัปเดตโลโก้สำเร็จ!');
                                            fetchData();
                                        } catch (err) {
                                            alert(
                                                'เกิดข้อผิดพลาดในการอัปโหลดโลโก้'
                                            );
                                            console.error(err);
                                        }
                                    }
                                }}
                            />
                            <div>
                                <h1 className="text-2xl leading-tight font-bold">
                                    {profile.companyName}
                                </h1>
                                {profile.recruiterName && (
                                    <p className="text-lg text-white/90">
                                        {profile.recruiterName}
                                    </p>
                                )}
                                {profile.recruiterPosition && (
                                    <p className="text-base text-white/80">
                                        {profile.recruiterPosition}
                                    </p>
                                )}
                                <p className="text-base text-teal-100">
                                    {profile.user.email}
                                </p>
                            </div>
                        </div>

                        {/* ปุ่มแก้ไขข้อมูลบริษัท */}
                        <div className="flex flex-col items-end gap-2">
                            <button
                                onClick={() => setIsInfoSidebarOpen(true)}
                                className="flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-gray-100"
                            >
                                <Edit3 className="h-4 w-4" /> แก้ไขข้อมูลบริษัท
                            </button>
                        </div>
                    </div>
                </div>
                {/* Body Content */}
                <div className="mx-auto mt-6 max-w-7xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* --- คอลัมน์ซ้าย --- */}
                    <div className="space-y-6">
                        {/* 1. การ์ดวิดีโอแนะนำบริษัท */}
                        <VideoUploadCard
                            videoUrl={profile.videoUrl}
                            onEditClick={() => setIsVideoSidebarOpen(true)}
                            role="COMPANY"
                        />

                        {/* 2. การ์ดข้อมูลติดต่อ */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">ข้อมูลติดต่อ</h2>
                                <button
                                    onClick={() => setIsContactSidebarOpen(true)}
                                    className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-teal-600 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    aria-label="แก้ไขข้อมูลติดต่อ"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                {profile.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="mt-1 flex-shrink-0 text-gray-400" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.emails.map(e => (
                                    <div key={e.id} className="flex items-start gap-3">
                                        <Mail size={18} className="mt-1 flex-shrink-0 text-gray-400" />
                                        <a href={`mailto:${e.email}`} className="break-all hover:underline">{e.email}</a>
                                    </div>
                                ))}
                                {profile.phones.map(p => (
                                    <div key={p.id} className="flex items-start gap-3">
                                        <Phone size={18} className="mt-1 flex-shrink-0 text-gray-400" />
                                        <span>{p.phone}</span>
                                    </div>
                                ))}
                                {profile.additionalContactInfo && (
                                    <div className="mt-3 border-t border-gray-100 pt-3">
                                        <h3 className="mb-2 font-semibold text-gray-800">ช่องทางติดต่อเพิ่มเติม</h3>
                                        <div className="flex items-start gap-3">
                                            <Linkify text={profile.additionalContactInfo} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. การ์ดข้อมูลทางทะเบียน */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">ข้อมูลทางทะเบียน</h2>
                                <button
                                    onClick={() => setIsRegistrationSidebarOpen(true)}
                                    className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-teal-600 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    aria-label="แก้ไขข้อมูลทางทะเบียน"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700 md:grid-cols-2">
                                <p><span className="font-semibold">ชื่อนิติบุคคล:</span> {profile.legalName || '-'}</p>
                                <p><span className="font-semibold">ประเภทนิติบุคคล:</span> {profile.companyType || '-'}</p>
                                <p><span className="font-semibold">เลขทะเบียน:</span> {profile.registrationNumber || '-'}</p>
                                <p><span className="font-semibold">จังหวัด:</span> {profile.province || '-'}</p>
                                <p className="col-span-2"><span className="font-semibold">ประเภทธุรกิจ:</span> {profile.businessTypeName || '-'}</p>
                                <p className="col-span-2"><span className="font-semibold">ทุนจดทะเบียน:</span> {profile.registeredCapital?.toLocaleString('th-TH') || '-'} บาท</p>
                            </div>
                        </div>
                    </div>

                    {/* --- คอลัมน์ขวา --- */}
                    <div className="space-y-6">
                        {/* การ์ดรายชื่อบุคคลที่สนใจ */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">รายชื่อบุคคลที่สนใจ</h2>
                                </div>
                                <span className="text-sm text-gray-500">{interestedStudents.length} คน</span>
                            </div>
                            {isLoading ? (
                                <p className="py-4 text-center text-gray-500">กำลังโหลดรายชื่อ...</p>
                            ) : (
                                <div className="space-y-3">
                                    {interestedStudents.length > 0 ? (
                                        interestedStudents.map(({ id, student }) => (
                                            <div key={id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                                                <div className="space-y-1 text-base">
                                                    <p className="text-gray-800"><span className="font-semibold">ชื่อ:</span> {student.fullName}</p>
                                                    <p className="text-gray-800"><span className="font-semibold">ตำแหน่ง:</span><span className="text-teal-600"> {student.desiredPosition || 'ไม่ระบุ'}</span></p>
                                                    <p className="text-gray-800"><span className="font-semibold">มหาวิทยาลัย:</span> {student.internshipApplications[0]?.universityName || 'ไม่ระบุ'}</p>
                                                    <p className="text-gray-800"><span className="font-semibold">สาขาวิชา:</span> {student.major || 'ไม่ระบุ'}</p>
                                                </div>
                                                <div>
                                                    <Link to={`/students/${student.id}`} className="rounded-lg border border-teal-500 bg-white px-5 py-2 text-sm font-medium text-teal-600 shadow-sm transition-colors hover:bg-teal-50">
                                                        ดูโปรไฟล์
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-4 text-center text-sm text-gray-400">ยังไม่มีนักศึกษาที่สนใจ</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            </div>

            <Sidebar
                openSidebar={isInfoSidebarOpen}
                setOpenSidebar={setIsInfoSidebarOpen}
            >
                <CompanyInfoSide
                    currentProfile={profile}
                    onClose={handleInfoSidebarClose}
                    onUpdate={fetchData}
                />
            </Sidebar>

            <Sidebar
                openSidebar={isContactSidebarOpen}
                setOpenSidebar={setIsContactSidebarOpen}
            >
                <ContactInfoSide
                    currentProfile={profile}
                    // currentEmails={profile?.emails || []}
                    // currentPhones={profile?.phones || []}
                    onUpdate={fetchData}
                    onClose={handleContactSidebarClose}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isRegistrationSidebarOpen}
                setOpenSidebar={setIsRegistrationSidebarOpen}
            >
                <CompanyRegistrationSide
                    currentProfile={profile}
                    onUpdate={fetchData}
                    onClose={() => setIsRegistrationSidebarOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isVideoSidebarOpen}
                setOpenSidebar={setIsVideoSidebarOpen}
            >
                <CompanyVideoSide
                    currentVideoUrl={profile?.videoUrl || null}
                    onUpdate={fetchData}
                    onClose={() => setIsVideoSidebarOpen(false)}
                />
            </Sidebar>
        </>
    );
};

export default CompanyPage;
