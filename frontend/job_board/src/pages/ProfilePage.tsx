import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
    internshipApplications: any[];
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
    const { user, isAuthenticated } = useAuth();
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

    useEffect(() => {
        const fetchProfile = async () => {
            if (isAuthenticated && user?.role === 'CANDIDATE') {
                setIsLoading(true);
                try {
                    const response = await api.get<CandidateProfile>(
                        '/profiles/candidate/me'
                    );
                    setProfile(response.data);
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user]);

    const handleProfileUpdate = (newProfileData: CandidateProfile) => {
        //แทนที่ state profile ทั้งหมดด้วยข้อมูลใหม่ที่ได้รับจาก API โดยตรง
        console.log('Received new profile data to update:', newProfileData);
        setProfile(newProfileData);
    };

    const handleSkillsUpdate = (newSkills: Skill[]) => {
        console.log('Updating skills:', newSkills);
    };

    const handleDeleteWorkHistory = async (workHistoryId: string) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
            return;
        }
        try {
            await api.delete(`/work-history/${workHistoryId}`);
            alert('ลบข้อมูลเรียบร้อย');
            const response = await api.get<CandidateProfile>(
                '/profiles/candidate/me'
            );
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to delete work history:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    const handleDeleteCertificate = async (fileId: string) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์นี้?')) {
            return;
        }
        try {
            await api.delete(`/certificate-files/${fileId}`);
            alert('ลบไฟล์เรียบร้อย');
            const response = await api.get<CandidateProfile>(
                '/profiles/candidate/me'
            );
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to delete certificate file:', error);
            alert('เกิดข้อผิดพลาดในการลบไฟล์');
        }
    };

    const handleResumeUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. สร้าง FormData object
        const formData = new FormData();
        // 2. เพิ่มไฟล์เข้าไปใน formData โดยตั้งชื่อ field ว่า 'file' ให้ตรงกับที่ backend กำหนด
        formData.append('file', file);

        alert(`กำลังอัปโหลดไฟล์: ${file.name}`);
        try {
            // 3. ส่ง formData ไปที่ API และระบุ header ให้ถูกต้อง
            await api.post('/contact-files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // ดึงข้อมูลโปรไฟล์มาใหม่เพื่ออัปเดต UI
            const response = await api.get('/profiles/candidate/me');
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to upload resume:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดเรซูเม่');
        }
    };
    const handleRemoveResume = async (fileId: string) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์เรซูเม่นี้?')) {
            return;
        }
        try {
            await api.delete(`/contact-files/${fileId}`);
            const response = await api.get('/profiles/candidate/me');
            handleProfileUpdate(response.data);
        } catch (error) {
            console.error('Failed to remove resume:', error);
            alert('เกิดข้อผิดพลาดในการลบเรซูเม่');
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
        profileImage:
            profile.profileImageUrl ||
            'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face',
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
        certificateFiles: [], // Placeholder
        contactFiles: [], // Placeholder
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                user={userDataForHeader}
                completionRate={50}
                onUpdateProfile={() => setIsPersonalInfoFormOpen(true)}
            />

            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <ProfileCard
                            title="ข้อมูลส่วนตัวของคุณ"
                            content={profile.bio}
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มข้อมูลส่วนตัวของคุณ"
                            onEditClick={() => setIsPersonalInfoFormOpen(true)}
                        />
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
                                                className="border-b border-gray-100 pb-3 text-sm last:border-b-0 last:pb-0"
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
                                                    } //ทำงานกับ job.id ของรายการนี้เท่านั้น
                                                    className="rounded-full p-2 text-red-500 transition-colors hover:text-red-700"
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
                            {/* ตรวจสอบว่ามีข้อมูล certificateFiles หรือไม่ */}
                            {profile.certificateFiles &&
                                profile.certificateFiles.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* วนลูปแสดงผลไฟล์แต่ละรายการ */}
                                        {profile.certificateFiles.map(
                                            (file: any) => (
                                                <div
                                                    key={file.id}
                                                    className="group relative overflow-hidden rounded-lg border"
                                                >
                                                    {/* ส่วนแสดงผล: ถ้าเป็นไฟล์รูปให้แสดงรูป, ถ้าไม่ให้แสดงไอคอน */}
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

                                                    {/* ส่วนแสดงรายละเอียด (ถ้ามี) */}
                                                    {file.description && (
                                                        <div className="p-3">
                                                            <p className="text-sm text-gray-700">
                                                                {
                                                                    file.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* ปุ่มลบ จะปรากฏเมื่อเอาเมาส์ไปชี้ (group-hover) */}
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
                        <VideoUploadCard
                            videoUrl={profile.videoUrl}
                            onEditClick={() => setIsVideoFormOpen(true)}
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
                                                    className="group flex items-center justify-between rounded border bg-gray-50 p-3"
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
                                                        className="mr-8 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-700" // << เพิ่ม mr-2 เข้าไป
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </ProfileCard>
                        <SkillsCard
                            skills={userDataForHeader.customSkills}
                            onUpdateSkills={handleSkillsUpdate}
                        />
                        <ProfileCard
                            title="รายละเอียดการฝึกงาน"
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อกรอกรายละเอียดการสมัครฝึกงาน"
                            onEditClick={() => setIsApplicationFormOpen(true)}
                        >
                            {/* ตรวจสอบว่ามีข้อมูลใบสมัครหรือไม่ */}
                            {profile.internshipApplications &&
                            profile.internshipApplications.length > 0 ? (
                                <div className="space-y-2 text-sm text-gray-800">
                                    {/* โดยปกติจะมีแค่ 1 record สำหรับ 1 บริษัท */}
                                    {profile.internshipApplications.map(
                                        (app: any) => (
                                            <div key={app.id}>
                                                <p>
                                                    <span className="font-semibold">
                                                        ตำแหน่งงานที่สนใจ :
                                                    </span>{' '}
                                                    {app.positionOfInterest}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        ชื่อมหาวิทยาลัย /
                                                        สถานศึกษา :
                                                    </span>{' '}
                                                    {app.universityName}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        วันที่เริ่ม :
                                                    </span>{' '}
                                                    {new Date(
                                                        app.startDate
                                                    ).toLocaleDateString(
                                                        'th-TH'
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        วันที่สิ้นสุด :
                                                    </span>{' '}
                                                    {new Date(
                                                        app.endDate
                                                    ).toLocaleDateString(
                                                        'th-TH'
                                                    )}
                                                </p>
                                                <p className="mt-2 font-semibold">
                                                    เหตุผลที่อยากฝึกงานกับเรา :
                                                </p>
                                                <p className="whitespace-pre-wrap text-gray-600">
                                                    {app.reason}
                                                </p>
                                            </div>
                                        )
                                    )}
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
                    currentApplication={
                        profile.internshipApplications?.[0] || null
                    }
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsApplicationFormOpen(false)}
                />
            </Sidebar>
        </div>
    );
};

export default ProfilePage;
