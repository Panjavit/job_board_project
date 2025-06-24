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
    PersonalInfoForm
} from '../components';

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
    const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
    const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (isAuthenticated && user?.role === 'CANDIDATE') {
                setIsLoading(true);
                try {
                    const response = await api.get<CandidateProfile>('/profiles/candidate/me');
                    setProfile(response.data);
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user]);


    const handleProfileUpdate = (updatedData: Partial<CandidateProfile>) => {
        if (profile) {
            setProfile(prev => ({ ...prev!, ...updatedData }));
        }
    };

    const handleSkillsUpdate = (newSkills: Skill[]) => {
        console.log("Updating skills:", newSkills);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 text-center py-20 font-semibold">กำลังโหลดข้อมูลโปรไฟล์...</div>;
    }

    if (!profile) {
        return <div className="min-h-screen bg-gray-50 text-center py-20 text-red-500">ไม่พบข้อมูลโปรไฟล์ กรุณาเข้าสู่ระบบ</div>;
    }

    
    const userDataForHeader: UserDataForHeader = {
        name: profile.fullName,
        position: profile.desiredPosition || 'ยังไม่ได้ระบุตำแหน่ง',
        email: profile.contactEmail,
        phone: profile.phoneNumber || 'ยังไม่ได้ระบุเบอร์โทร',
        profileImage: profile.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face',
        about: profile.bio || '',
        experience: profile.experience || '',
        education: profile.education || '',
        projects: profile.projects || '',
        achievements: profile.achievements || '',
        customSkills: profile.skills.map(s => ({ name: s.skill.name, level: s.rating })),
        videoUrl: profile.videoUrl,
        certificateFiles: [], // Placeholder
        contactFiles: []      // Placeholder
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                user={userDataForHeader} completionRate={50} onUpdateProfile={() => setIsPersonalInfoFormOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <ProfileCard
                            title="ข้อมูลส่วนตัวของคุณ"
                            content={profile.bio }
                            placeholder= "คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มข้อมูลส่วนตัว"
                            onEditClick={() => setIsPersonalInfoFormOpen(true)}
                        />
                        <ProfileCard
                            title="ประสบการณ์การทำงานของคุณ"
                            content={profile.experience}
                            placeholder= "คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มประสบการณ์ทำงาน"
                            onEditClick={() => { /* Logic to open edit modal */ }}
                        />
                        <ProfileCard
                            title="ข้อมูลการศึกษา"
                            content={profile.education}
                            placeholder= "คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มข้อมูลการศึกษา"
                            onEditClick={() => { /* Logic to open edit modal */ }}
                        />
                        <FileUploadCard
                            title="รางวัลหรือใบประกาศนียบัตร"
                            files={[]}
                            onFileUpload={() => {}}
                            onRemoveFile={() => {}}
                        />
                    </div>

                    <div className="space-y-6">
                        <VideoUploadCard
                            videoUrl={profile.videoUrl}
                            onVideoUpload={() => {}}
                        />
                        <FileUploadCard
                            title="เรซูเม่"
                            files={[]}
                            onFileUpload={() => {}}
                            onRemoveFile={() => {}}
                        />
                        <SkillsCard
                            skills={userDataForHeader.customSkills}
                            onUpdateSkills={handleSkillsUpdate}
                        />
                        <ProfileCard
                            title="ผลงาน/โปรเจค"
                            content={profile.projects}
                            placeholder="คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มผลงาน"
                            onEditClick={() => { /* Logic to open edit modal */ }}
                        />
                        <ProfileCard
                            title="รายละเอียดเพิ่มเติม"
                            content={profile.achievements}
                            placeholder= "คลิก 'เพิ่มข้อมูล' เพื่อเพิ่มรายละเอียด"
                            onEditClick={() => { /* Logic to open edit modal */ }}
                        />
                    </div>
                </div>
            </div>
             <Sidebar openSidebar={isPersonalInfoFormOpen} setOpenSidebar={setIsPersonalInfoFormOpen}>
                <PersonalInfoForm
                    currentProfile={profile}
                    onUpdate={handleProfileUpdate}
                    onClose={() => setIsPersonalInfoFormOpen(false)}
                />
            </Sidebar>
        </div>
    );
};

export default ProfilePage;