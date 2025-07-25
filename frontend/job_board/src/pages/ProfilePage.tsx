import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import ResumeAnalysisCard from '../components/ResumeAnalysisCard';
import PortfolioSide from '../components/PortfolioSide';
import toast from 'react-hot-toast';

import {
    ProfileHeader,
    ProfileCard,
    SkillsCard,
    FileUploadCard,
    VideoUploadCard,
    Sidebar,
    PersonalInfoForm,
    EducationSide,
} from '../components';

import WorkHistorySide from '../components/WorkHistorySide';
import CertificateSide from '../components/CertificateSide';
import VideoSide from '../components/VideoSide';
import ResumeSide from '../components/ResumeSide';
import InternshipApplicationSide from '../components/InternshipApplicationSide';
import SkillsSide from '../components/SkillsSide';

interface CandidateProfile {
    id: string;
    fullName: string;
    contactEmail: string;
    phoneNumber: string | null;
    desiredPosition: string | null;
    bio: string | null;
    experience: string | null;
    education: string | null;
    projects: string | null;
    achievements: string | null;
    profileImageUrl: string | null;
    videoUrl: string | null;
    skills: {
        skill: { name: string };
        rating: number;
    }[];
    certificateFiles: any[];
    contactFiles: any[];
    workHistory: any[];
    major: string | null;
    studyYear: number | null;

    interests?: {
        createdAt: string;
        company: {
            id: string;
            companyName: string;
            logoUrl: string | null;
            businessTypeName: string | null;
            province: string | null;
            registeredCapital: number | null;
            workArrangement: string | null;
        };
    }[];
    isInterested?: boolean;
    portfolioUrl: string | null;
    positionOfInterest: string | null;
    universityName: string | null;
    startDate: string | null; // ใน frontend จะเป็น string ก่อนแปลง
    endDate: string | null;
    reason: string | null;
    internshipType: string | null;
}

interface Skill {
    name: string;
    level: number;
}

interface UserDataForHeader {
    name: string;
    position: string;
    email: string;
    phone: string;
    profileImage: string;
    about: string;
    experience: string;
    education: string;
    projects: string;
    achievements: string;
    customSkills: Skill[];
    videoUrl: string | null;
    certificateFiles: any[];
    contactFiles: any[];
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [isPersonalInfoFormOpen, setIsPersonalInfoFormOpen] = useState(false);
    const [isWorkHistoryFormOpen, setIsWorkHistoryFormOpen] = useState(false);
    const [editingWorkHistory, setEditingWorkHistory] = useState<any | null>(
        null
    );
    const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
    const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
    const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
    const [isResumeFormOpen, setIsResumeFormOpen] = useState(false);
    const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
    const [isSkillsFormOpen, setIsSkillsFormOpen] = useState(false);
    const [isAnalysisSidebarOpen, setIsAnalysisSidebarOpen] = useState(false);
    const [isPortfolioFormOpen, setIsPortfolioFormOpen] = useState(false);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get<CandidateProfile>(
                '/profiles/candidate/me'
            );
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const calculateCompletion = (p: CandidateProfile | null): number => {
        if (!p) return 0;
        const completionChecks = [
            !!p.profileImageUrl,
            !!p.bio,
            p.workHistory && p.workHistory.length > 0,
            !!p.major || !!p.studyYear,
            p.certificateFiles && p.certificateFiles.length > 0,
            !!p.videoUrl,
            p.skills && p.skills.length > 0,
        ];
        const completedCount = completionChecks.filter(Boolean).length;
        const percentage = Math.round(
            (completedCount / completionChecks.length) * 100
        );
        return percentage;
    };

    const handleAnalysisComplete = (
        analyzedSkills: { name: string; level: number }[]
    ) => {
        // นำ skill ใหม่มารวมกับของเก่า (ป้องกันการซ้ำ)
        setProfile(prev => {
            if (!prev) return null;
            const skillMap = new Map(
                prev.skills.map(s => [
                    s.skill.name.toLowerCase(),
                    { name: s.skill.name, rating: s.rating },
                ])
            );

            analyzedSkills.forEach(newSkill => {
                skillMap.set(newSkill.name.toLowerCase(), {
                    name: newSkill.name,
                    rating: newSkill.level,
                });
            });

            const updatedSkillsForState = Array.from(skillMap.values()).map(
                s => ({
                    skill: { name: s.name },
                    rating: s.rating,
                })
            );

            return { ...prev, skills: updatedSkillsForState };
        });

        //เปิด Sidebar ของฟอร์มแก้ไขทักษะเพื่อให้ผู้ใช้ยืนยันและบันทึก
        setIsSkillsFormOpen(true);
    };

    const completionRate = useMemo(
        () => calculateCompletion(profile),
        [profile]
    );

    console.log('ค่า completionRate ที่คำนวณได้:', completionRate);

    const handleProfileUpdate = (newProfileData: CandidateProfile) => {
        setProfile(newProfileData);
    };

    const handleSkillsUpdate = (newSkills: Skill[]) => {
        console.log('Updating skills:', newSkills);
    };

    const handleDeleteWorkHistory = async (workHistoryId: string) => {
        try {
            await api.delete(`/work-history/${workHistoryId}`);
            toast.success('ลบข้อมูลเรียบร้อย');
            fetchProfile(); // เรียกข้อมูลใหม่
        } catch (error) {
            console.error('Failed to delete work history:', error);
            toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    const handleDeleteCertificate = async (fileId: string) => {
        try {
            await api.delete(`/certificate-files/${fileId}`);
            toast.success('ลบไฟล์เรียบร้อย');
            const response = await api.get('/profiles/candidate/me');
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to delete certificate file:', error);
            toast.error('เกิดข้อผิดพลาดในการลบไฟล์');
        }
    };

    const handleHeaderSave = async (headerData: {
        name: string;
        phone: string;
    }) => {
        try {
            //เตรียมข้อมูลที่จะส่งไปอัปเดต
            const payload = {
                fullName: headerData.name,
                phoneNumber: headerData.phone,
            };

            //ส่ง PATCH request เพื่ออัปเดตข้อมูล
            await api.patch('/profiles/candidate/me/personal-info', payload);

            //ดึงข้อมูลโปรไฟล์ฉบับเต็มล่าสุดมาอัปเดตหน้าเว็บ
            const response = await api.get<CandidateProfile>(
                '/profiles/candidate/me'
            );
            setProfile(response.data);

            toast.success('อัปเดตข้อมูลสำเร็จ!');
        } catch (error) {
            console.error('Failed to save header data:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleResumeUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        //สร้าง FormData object
        const formData = new FormData();
        //เพิ่มไฟล์เข้าไปใน formData โดยตั้งชื่อ field ว่า 'file' ให้ตรงกับที่ backend กำหนด
        formData.append('file', file);

        toast.success(`กำลังอัปโหลดไฟล์: ${file.name}`);
        try {
            //ส่ง formData ไปที่ API และระบุ header ให้ถูกต้อง
            await api.post('/contact-files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            //ดึงข้อมูลโปรไฟล์มาใหม่เพื่ออัปเดต UI
            const response = await api.get('/profiles/candidate/me');
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to upload resume:', error);
            toast.error('เกิดข้อผิดพลาดในการอัปโหลดเรซูเม่');
        }
    };
    const handleRemoveResume = async (fileId: string) => {
        try {
            await api.delete(`/contact-files/${fileId}`);
            const response = await api.get('/profiles/candidate/me');
            handleProfileUpdate(response.data);
            toast.success('ลบไฟล์สำเร็จ');
        } catch (error) {
            console.error('Failed to remove resume:', error);
            toast.error('เกิดข้อผิดพลาดในการลบเรซูเม่');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 text-center font-semibold">
                กำลังโหลดข้อมูลโปรไฟล์...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 text-center text-red-500">
                ไม่พบข้อมูลโปรไฟล์ กรุณาเข้าสู่ระบบ
            </div>
        );
    }

    const userDataForHeader: UserDataForHeader = {
        name: profile.fullName,
        position: profile.desiredPosition || 'ยังไม่ได้ระบุตำแหน่ง',
        email: profile.contactEmail,
        phone: profile.phoneNumber || 'ยังไม่ได้ระบุเบอร์โทร',
        profileImage: profile.profileImageUrl
            ? `http://localhost:5001${profile.profileImageUrl}`
            : 'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face',
        about: profile.bio || '',
        experience: profile.experience || '',
        education: profile.education || '',
        projects: profile.projects || '',
        achievements: profile.achievements || '',
        customSkills: profile.skills.map(s => ({
            name: s.skill.name,
            level: s.rating,
        })),
        videoUrl: profile.videoUrl,
        certificateFiles: [],
        contactFiles: [],
    };

    const getInternshipTypeText = (type: string | null) => {
        switch (type) {
            case 'FULL_TIME':
                return 'พนักงานประจำ (Full-time)';
            case 'PART_TIME':
                return 'พาร์ทไทม์ (Part-time)';
            case 'INTERNSHIP':
                return 'ฝึกงาน (Internship)';
            default:
                return 'ไม่ระบุ';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                user={userDataForHeader}
                completionRate={completionRate}
                // onEditClick={() => setIsPersonalInfoFormOpen(true)}
                onSave={handleHeaderSave}
                onProfileUpdate={fetchProfile}
            />

            <div className="mx-auto max-w-7xl px-6 py-6">
                {profile.interests && profile.interests.length > 0 && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            บริษัทที่สนใจในโปรไฟล์ของคุณ
                        </h2>
                        <ul className="space-y-3">
                            {profile.interests.map((interest, index) => (
                                <li key={interest.company.id}>
                                    <Link
                                        to={`/company/${interest.company.id}`}
                                        className="flex w-full items-center gap-4 rounded-md bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md"
                                    >
                                        {/* ส่วนโลโก้ */}
                                        {interest.company.logoUrl ? (
                                            <img
                                                src={`http://localhost:5001${interest.company.logoUrl}`}
                                                alt={
                                                    interest.company.companyName
                                                }
                                                className="h-16 w-16 flex-shrink-0 rounded-lg bg-white object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-xl font-bold text-teal-600">
                                                {interest.company.companyName.substring(
                                                    0,
                                                    2
                                                )}
                                            </div>
                                        )}

                                        {/* ส่วนข้อมูล */}
                                        <div className="flex-grow">
                                            <p className="font-bold text-gray-800">
                                                ชื่อบริษัท:&nbsp;&nbsp;
                                                {interest.company.companyName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ประเภทธุรกิจ:&nbsp;&nbsp;
                                                {interest.company
                                                    .businessTypeName ||
                                                    'ไม่ระบุประเภทธุรกิจ'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                จังหวัด:&nbsp;&nbsp;
                                                {interest.company.province ||
                                                    'ไม่ระบุจังหวัด'}
                                            </p>
                                            {interest.company
                                                .registeredCapital && (
                                                <p className="text-sm text-gray-500">
                                                    ทุนจดทะเบียน:&nbsp;&nbsp;
                                                    {interest.company.registeredCapital.toLocaleString(
                                                        'th-TH'
                                                    )}{' '}
                                                    บาท
                                                </p>
                                            )}
                                            {interest.company
                                                .workArrangement && (
                                                <p className="text-sm text-gray-500">
                                                    รูปแบบการทำงาน:&nbsp;&nbsp;
                                                    {getInternshipTypeText(
                                                        interest.company
                                                            .workArrangement
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* ส่วนวันที่ (ชิดขวา) */}
                                        <div className="self-start text-right text-xs text-gray-400">
                                            <p>สนใจเมื่อ</p>
                                            <p>
                                                {new Date(
                                                    interest.createdAt
                                                ).toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <ProfileCard
                            title="ข้อมูลส่วนตัวของคุณ"
                            content={profile.bio}
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มข้อมูลส่วนตัวของคุณ"
                            onEditClick={() => setIsPersonalInfoFormOpen(true)}
                        />
                        <ProfileCard
                            title="ผลงาน"
                            onEditClick={() => setIsPortfolioFormOpen(true)}
                        >
                            {profile.portfolioUrl ? (
                                <a
                                    href={profile.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                >
                                    <i className="fa-solid fa-link text-lg"></i>
                                    <span className="truncate">
                                        {profile.portfolioUrl}
                                    </span>
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ยังไม่มีการเพิ่มลิงก์ผลงาน
                                </p>
                            )}
                        </ProfileCard>
                        <ProfileCard
                            title="ประสบการณ์การทำงานของคุณ"
                            // ไม่มี content={profile.experience} แล้ว
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มประวัติการทำงานเพื่อให้บริษัททราบถึงประสบการณ์ของคุณ"
                            onEditClick={() => {
                                setEditingWorkHistory(null);
                                setIsWorkHistoryFormOpen(true);
                            }}
                        >
                            {/* ส่วน children จะทำงานอย่างถูกต้อง */}
                            {profile.workHistory &&
                                profile.workHistory.length > 0 && (
                                    <div className="space-y-4">
                                        {profile.workHistory.map((job: any) => (
                                            <div
                                                key={job.id}
                                                className="group relative border-b border-gray-100 p-3 text-sm last:border-b-0"
                                            >
                                                <p className="text-gray-800">
                                                    <span className="font-semibold">
                                                        ตำแหน่งงาน :
                                                    </span>{' '}
                                                    {job.position}
                                                </p>
                                                <p className="text-gray-800">
                                                    <span className="font-semibold">
                                                        บริษัท :
                                                    </span>{' '}
                                                    {job.companyName}
                                                </p>
                                                <p className="text-gray-800">
                                                    <span className="font-semibold">
                                                        วันที่เริ่ม :
                                                    </span>
                                                    {new Date(
                                                        job.startDate
                                                    ).toLocaleDateString(
                                                        'th-TH',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                                <p className="text-gray-800">
                                                    <span className="font-semibold">
                                                        วันสิ้นสุด :
                                                    </span>
                                                    {job.endDate
                                                        ? new Date(
                                                              job.endDate
                                                          ).toLocaleDateString(
                                                              'th-TH',
                                                              {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                              }
                                                          )
                                                        : ' ปัจจุบัน'}
                                                </p>
                                                {job.description && (
                                                    <div className="mt-2 rounded-md bg-gray-50 p-3">
                                                        <p className="whitespace-pre-wrap text-gray-600">
                                                            <span className="font-semibold">
                                                                รายละเอียดการทำงาน
                                                                :
                                                            </span>
                                                            {job.description}
                                                        </p>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        handleDeleteWorkHistory(
                                                            job.id
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 opacity-0 shadow transition-opacity group-hover:opacity-100"
                                                    aria-label="ลบรายการนี้"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </ProfileCard>

                        <ProfileCard
                            title="ข้อมูลการศึกษา"
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มข้อมูลการศึกษา"
                            onEditClick={() => setIsEducationFormOpen(true)}
                        >
                            {/* ตรวจสอบว่ามีข้อมูลอย่างน้อยหนึ่งอย่างหรือไม่ ถ้ามีให้แสดงผล */}
                            {profile.major ||
                            profile.studyYear ||
                            profile.education ? (
                                <div className="space-y-2 text-sm text-gray-800">
                                    <p>
                                        <span className="font-semibold">
                                            หลักสูตรหรือวุฒิการศึกษา :
                                        </span>{' '}
                                        {profile.major || '-'}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            ระดับการศึกษา/ชั้นปี :
                                        </span>{' '}
                                        {profile.studyYear || '-'}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            รายละเอียดเพิ่มเติม :
                                        </span>{' '}
                                        {profile.education || '-'}
                                    </p>
                                </div>
                            ) : null}
                        </ProfileCard>
                        <ProfileCard
                            title="รางวัลหรือใบประกาศนียบัตร"
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อแนบไฟล์รางวัลหรือใบประกาศ"
                            onEditClick={() => setIsCertificateFormOpen(true)}
                        >
                            {profile.certificateFiles &&
                                profile.certificateFiles.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {profile.certificateFiles.map(
                                            (file: any) => (
                                                <div
                                                    key={file.id}
                                                    className="group relative overflow-hidden rounded-lg border"
                                                >
                                                    {/* ทำให้รูปภาพเป็นลิงก์ที่เปิดได้ */}
                                                    <a
                                                        href={`http://localhost:5001${file.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {file.type.startsWith(
                                                            'image/'
                                                        ) ? (
                                                            <img
                                                                src={`http://localhost:5001${file.url}`}
                                                                alt={file.name}
                                                                className="h-40 w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-40 w-full flex-col items-center justify-center bg-gray-100 p-4 text-center">
                                                                <i className="fa-solid fa-file-alt text-4xl text-gray-400"></i>
                                                                <span className="mt-2 text-xs break-all text-gray-600">
                                                                    {file.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </a>

                                                    {file.description && (
                                                        <div className="p-3">
                                                            <p className="text-sm text-gray-700">
                                                                {
                                                                    file.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* ปุ่มลบ จะปรากฏเมื่อเอาเมาส์ไปชี้ และเรียกฟังก์ชันที่ถูกต้อง */}
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteCertificate(
                                                                file.id
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 opacity-0 shadow transition-opacity group-hover:opacity-100"
                                                        aria-label="ลบไฟล์นี้"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </ProfileCard>
                    </div>

                    <div className="space-y-6">
                        <ResumeAnalysisCard
                            onAnalysisComplete={handleAnalysisComplete}
                        />
                        <VideoUploadCard
                            videoUrl={profile.videoUrl}
                            onEditClick={() => setIsVideoFormOpen(true)}
                            role="CANDIDATE"
                        />
                        <ProfileCard
                            title="เรซูเม่"
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อแนบไฟล์เรซูเม่ของคุณ"
                            onEditClick={() => setIsResumeFormOpen(true)}
                        >
                            {/* แสดงรายการไฟล์เรซูเม่ที่เคยอัปโหลด */}
                            {profile.contactFiles &&
                                profile.contactFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {profile.contactFiles.map(
                                            (file: any) => (
                                                <div
                                                    key={file.id}
                                                    className="group relative flex items-center justify-between rounded border bg-gray-50 p-3"
                                                >
                                                    <a
                                                        href={`http://localhost:5001${file.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm text-teal-600 hover:underline"
                                                    >
                                                        <i className="fa-solid fa-file-lines"></i>
                                                        {file.name}
                                                    </a>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveResume(
                                                                file.id
                                                            )
                                                        }
                                                        className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-red-500 opacity-0 shadow transition-opacity group-hover:opacity-100"
                                                        aria-label="ลบไฟล์เรซูเม่"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </ProfileCard>
                        <ProfileCard
                            title="ทักษะ"
                            placeholder="เพิ่มทักษะที่จำเป็นสำหรับตำแหน่งงานที่คุณสนใจ (กรอกรายละเอียดฝึกงานก่อนเพื่อเพิ่มตำแหน่งงาน)"
                            // onEditClick={() => setIsSkillsFormOpen(true)}
                            actionsSlot={
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setIsSkillsFormOpen(true)
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white transition-transform duration-200 ease-in-out hover:scale-110 hover:bg-teal-600"
                                        aria-label="แก้ไข ทักษะ"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            }
                        >
                            {profile.skills && profile.skills.length > 0 ? (
                                <div className="space-y-3">
                                    {[...profile.skills] // สร้างสำเนาของ array
                                        .sort((a, b) => b.rating - a.rating) // เรียงลำดับจากมากไปน้อย (descending)
                                        .map(
                                            (
                                                s: any // แสดงผลข้อมูลที่เรียงลำดับแล้ว
                                            ) => (
                                                <div key={s.skill.name}>
                                                    <div className="mb-1 flex items-center justify-between text-sm">
                                                        <span className="font-semibold text-gray-700">
                                                            {s.skill.name}
                                                        </span>
                                                        <span className="font-bold text-teal-600">
                                                            {s.rating}/10
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className="h-2.5 rounded-full bg-teal-500"
                                                            style={{
                                                                width: `${s.rating * 10}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            ) : null}
                        </ProfileCard>
                        <ProfileCard
                            title="รายละเอียดการฝึกงาน"
                            placeholder="คลิก 'แก้ไข' เพื่อกรอกรายละเอียดความสนใจในการฝึกงาน"
                            onEditClick={() => setIsApplicationFormOpen(true)}
                        >
                            {/* ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้ามีให้แสดงผล */}
                            {profile.positionOfInterest ? (
                                <div className="space-y-2 text-sm text-gray-800">
                                    <p>
                                        <span className="font-semibold">
                                            ตำแหน่งงานที่สนใจ :
                                        </span>{' '}
                                        {profile.positionOfInterest}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            รูปแบบ :
                                        </span>{' '}
                                        {getInternshipTypeText(
                                            profile.internshipType
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            ชื่อมหาวิทยาลัย / สถานศึกษา :
                                        </span>{' '}
                                        {profile.universityName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            วันที่เริ่ม :
                                        </span>{' '}
                                        {profile.startDate
                                            ? new Date(
                                                  profile.startDate
                                              ).toLocaleDateString('th-TH')
                                            : '-'}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            วันที่สิ้นสุด :
                                        </span>{' '}
                                        {profile.endDate
                                            ? new Date(
                                                  profile.endDate
                                              ).toLocaleDateString('th-TH')
                                            : '-'}
                                    </p>
                                    <div className="mt-2 border-t pt-2">
                                        <p className="font-semibold">
                                            เหตุผลที่อยากฝึกงานกับเรา :
                                        </p>
                                        <p className="whitespace-pre-wrap text-gray-600">
                                            {profile.reason}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </ProfileCard>
                    </div>
                </div>
            </div>
            <Sidebar
                openSidebar={isPersonalInfoFormOpen}
                setOpenSidebar={setIsPersonalInfoFormOpen}
            >
                <PersonalInfoForm
                    currentProfile={profile}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsPersonalInfoFormOpen(false)}
                />
            </Sidebar>

            <Sidebar
                openSidebar={isWorkHistoryFormOpen}
                setOpenSidebar={setIsWorkHistoryFormOpen}
            >
                <WorkHistorySide
                    workHistoryItem={editingWorkHistory}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsWorkHistoryFormOpen(false)}
                />
            </Sidebar>

            <Sidebar
                openSidebar={isEducationFormOpen}
                setOpenSidebar={setIsEducationFormOpen}
            >
                <EducationSide
                    currentProfile={profile}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsEducationFormOpen(false)}
                />
            </Sidebar>

            <Sidebar
                openSidebar={isCertificateFormOpen}
                setOpenSidebar={setIsCertificateFormOpen}
            >
                <CertificateSide
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsCertificateFormOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isVideoFormOpen}
                setOpenSidebar={setIsVideoFormOpen}
            >
                <VideoSide
                    currentProfile={profile}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsVideoFormOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isResumeFormOpen}
                setOpenSidebar={setIsResumeFormOpen}
            >
                <ResumeSide
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsResumeFormOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isApplicationFormOpen}
                setOpenSidebar={setIsApplicationFormOpen}
            >
                <InternshipApplicationSide
                    currentProfile={profile}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsApplicationFormOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isSkillsFormOpen}
                setOpenSidebar={setIsSkillsFormOpen}
            >
                <SkillsSide
                    currentSkills={profile.skills.map(s => ({
                        name: s.skill.name,
                        level: s.rating,
                    }))}
                    desiredPosition={profile.desiredPosition}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsSkillsFormOpen(false)}
                />
            </Sidebar>
            <Sidebar
                openSidebar={isPortfolioFormOpen}
                setOpenSidebar={setIsPortfolioFormOpen}
            >
                <PortfolioSide
                    currentPortfolioUrl={profile.portfolioUrl}
                    onUpdate={fetchProfile}
                    onClose={() => setIsPortfolioFormOpen(false)}
                />
            </Sidebar>
        </div>
    );
};

export default ProfilePage;
