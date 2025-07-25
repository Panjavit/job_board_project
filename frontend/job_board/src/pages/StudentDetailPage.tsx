import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

import { ProfileHeader, ProfileCard, VideoUploadCard } from '../components';

//Interface สำหรับข้อมูลที่ได้รับจาก API
interface CandidateProfile {
    id: string;
    fullName: string;
    contactEmail: string;
    phoneNumber: string | null;
    desiredPosition: string | null;
    bio: string | null;
    profileImageUrl: string | null;
    videoUrl: string | null;
    skills: { skill: { name: string }; rating: number }[];
    certificateFiles: any[];
    contactFiles: any[];
    workHistory: any[];
    major: string | null;
    studyYear: number | null;
    education: string | null;
    internshipApplications: any[];
    isInterestedByCompany?: boolean;
    experience: string | null;
    projects: string | null;
    achievements: string | null;
    portfolioUrl?: string | null;
    positionOfInterest: string | null;
    universityName: string | null;
    startDate: string | null;
    endDate: string | null;
    reason: string | null;
    internshipType: string | null;
}

//Interface สำหรับส่งข้อมูลให้ Header
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
    customSkills: { name: string; level: number }[];
    videoUrl: string | null;
    certificateFiles: any[];
    contactFiles: any[];
}

const StudentDetailPage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInterested, setIsInterested] = useState(false);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            if (!studentId) return;
            setIsLoading(true);
            try {
                const response = await api.get(`/students/${studentId}`);
                setProfile(response.data);
                setIsInterested(response.data.isInterestedByCompany || false);
            } catch (error) {
                console.error('Failed to fetch student profile:', error);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentProfile();
    }, [studentId]);

    if (isLoading) {
        return <div className="py-10 text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (!profile) {
        return (
            <div className="py-10 text-center text-red-500">
                ไม่พบข้อมูลโปรไฟล์ของนักศึกษา
            </div>
        );
    }

    const getInternshipTypeText = (type: string | undefined | null) => {
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
    };

    const handleShowInterest = async () => {
        if (!studentId) return;
        setIsSubmitting(true);
        try {
            await api.post(`/interactions/interest/${studentId}`, {
                contactInstructions:
                    'Email: yanisa.ph@pi.financial \nPhone: 064-494-7456',
            });
            toast.success('แสดงความสนใจสำเร็จ!');
            setIsInterested(true);
        } catch (error: any) {
            toast.error(
                `ไม่สามารถแสดงความสนใจได้: ${error.response?.data?.message || 'เกิดข้อผิดพลาด'}`
            );
            if (error.response?.status === 400) setIsInterested(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // สร้าง object userDataForHeader ให้มี property ครบถ้วนตามที่ Interface ใหม่กำหนด
    const userDataForHeader: UserDataForHeader = {
        name: profile.fullName,
        position: profile.desiredPosition || 'N/A',
        email: profile.contactEmail,
        phone: profile.phoneNumber || 'N/A',
        profileImage: profile.profileImageUrl
            ? `http://localhost:5001${profile.profileImageUrl}`
            : '',
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
        certificateFiles: profile.certificateFiles,
        contactFiles: profile.contactFiles || [],
    };

    const interestButton = (
        <button
            onClick={handleShowInterest}
            disabled={isInterested || isSubmitting}
            className={`w-48 rounded-lg bg-teal-500 px-4 py-3 text-base font-bold text-white transition-all hover:bg-teal-600 ${isInterested ? 'cursor-not-allowed bg-green-600' : ''} ${isSubmitting ? 'cursor-wait bg-gray-500' : ''} ${!isInterested && !isSubmitting ? 'bg-teal-500 hover:bg-teal-600' : ''} `}
        >
            {isSubmitting
                ? 'กำลังส่ง...'
                : isInterested
                  ? '✔️ สนใจแล้ว'
                  : 'แสดงความสนใจ'}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                user={userDataForHeader}
                completionRate={100}
                actionsSlot={interestButton}
            />

            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* ฝั่งซ้าย */}
                    <div className="space-y-6">
                        <ProfileCard
                            title="ข้อมูลส่วนตัว"
                            content={profile.bio}
                        />
                        <ProfileCard title="ผลงาน (Portfolio)">
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
                                    ไม่มีลิงก์ผลงาน
                                </p>
                            )}
                        </ProfileCard>
                        <ProfileCard title="ประสบการณ์การทำงานของคุณ">
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
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </ProfileCard>
                        <ProfileCard title="ข้อมูลการศึกษา">
                            {profile.major ||
                            profile.studyYear ||
                            profile.education ? (
                                <div className="space-y-2 text-sm text-gray-800">
                                    <p>
                                        <span className="font-semibold">
                                            หลักสูตร:
                                        </span>{' '}
                                        {profile.major || '-'}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            ชั้นปี:
                                        </span>{' '}
                                        {profile.studyYear || '-'}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            รายละเอียดเพิ่มเติม:
                                        </span>{' '}
                                        {profile.education || '-'}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ไม่มีข้อมูลการศึกษา
                                </p>
                            )}
                        </ProfileCard>
                        <ProfileCard title="รางวัลหรือใบประกาศนียบัตร">
                            {profile.certificateFiles &&
                            profile.certificateFiles.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {profile.certificateFiles.map(
                                        (file: any) => (
                                            <div
                                                key={file.id}
                                                className="group relative overflow-hidden rounded-lg border"
                                            >
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
                                                            {file.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ไม่มีรางวัลหรือใบประกาศนียบัตร
                                </p>
                            )}
                        </ProfileCard>
                    </div>
                    {/* ฝั่งขวา */}
                    <div className="space-y-6">
                        <VideoUploadCard videoUrl={profile.videoUrl} />
                        <ProfileCard title="เรซูเม่">
                            {profile.contactFiles &&
                            profile.contactFiles.length > 0 ? (
                                <div className="space-y-2">
                                    {profile.contactFiles.map((file: any) => (
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
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ไม่มีไฟล์เรซูเม่
                                </p>
                            )}
                        </ProfileCard>
                        <ProfileCard title="ทักษะ">
                            {profile.skills && profile.skills.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.skills
                                        .sort((a, b) => b.rating - a.rating)
                                        .map((s: any) => (
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
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ไม่มีทักษะที่ระบุ
                                </p>
                            )}
                        </ProfileCard>
                        <ProfileCard title="รายละเอียดการฝึกงาน">
                            {profile.positionOfInterest ? (
                                <div className="space-y-2 text-sm text-gray-800">
                                    <p>
                                        <span className="font-semibold">
                                            ตำแหน่งที่สนใจ:
                                        </span>{' '}
                                        {profile.positionOfInterest}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            รูปแบบ:
                                        </span>{' '}
                                        {getInternshipTypeText(
                                            profile.internshipType
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            ชื่อมหาวิทยาลัย:
                                        </span>{' '}
                                        {profile.universityName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            ช่วงเวลา:
                                        </span>{' '}
                                        {profile.startDate
                                            ? new Date(
                                                  profile.startDate
                                              ).toLocaleDateString('th-TH')
                                            : '-'}{' '}
                                        -{' '}
                                        {profile.endDate
                                            ? new Date(
                                                  profile.endDate
                                              ).toLocaleDateString('th-TH')
                                            : '-'}
                                    </p>
                                    <p className="mt-2 font-semibold">
                                        เหตุผลที่อยากฝึกงาน:
                                    </p>
                                    <p className="whitespace-pre-wrap text-gray-600">
                                        {profile.reason}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ยังไม่ได้กรอกรายละเอียดการฝึกงาน
                                </p>
                            )}
                        </ProfileCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;
