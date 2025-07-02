// components/ProfileHeader.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ProfileHeaderProps {
    user: CandidatProfile;
    completionRate?: number;
    onEditClick?: () => void;
    onSave?: (data: {
        name: string;
        phone: string;
        profileImage: string;
    }) => void;
    onProfileUpdate?: () => void;
    actionsSlot?: React.ReactNode;
}

interface CandidatProfile {
    name: string;
    position: string;
    company?: string;
    skills?: string;
    email: string;
    phone: string;
    about: string;
    experience: string;
    education: string;
    projects: string;
    achievements: string;
    customSkills: { name: string; level: number }[];
    videoUrl: string | null;
    profileImage: string;
    certificateFiles: any[];
    contactFiles: any[];
}
// ... (interfaces Skill, FileData เหมือนเดิม) ...

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    completionRate,
    onEditClick,
    onSave,
    onProfileUpdate,
    actionsSlot,
}) => {
    const [isEditingHeader, setIsEditingHeader] = useState<boolean>(false);
    const [tempData, setTempData] = useState({
        name: user.name || '',
        position: user.position || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
    });

    useEffect(() => {
        setTempData({
            name: user.name || '',
            position: user.position || '',
            email: user.email || '',
            phone: user.phone || '',
            profileImage: user.profileImage || '',
        });
    }, [user]);

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            if (event.target?.result) {
                setTempData(prev => ({
                    ...prev,
                    profileImage: event.target!.result as string,
                }));
            }
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/profiles/candidate/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('อัปโหลดรูปโปรไฟล์ใหม่สำเร็จ!');
            if (onProfileUpdate) onProfileUpdate(); // เรียกใช้ถ้ามี prop นี้ส่งมา
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        }
    };

    const handleSave = (): void => {
        if (onSave) {
            // ตรวจสอบก่อนเรียกใช้
            onSave(tempData);
        }
        setIsEditingHeader(false);
    };

    const handleCancel = (): void => {
        setIsEditingHeader(false);
    };

    if (isEditingHeader) {
        return (
            <div className="h-[200px] bg-gradient-to-r from-blue-900 to-purple-700 p-8 text-white">
                {/* ... JSX content ... */}
            </div>
        );
    }

    return (
        <div className="h-[200px] bg-gradient-to-r from-blue-900 to-purple-700 p-8 text-white">
            <div className="flex items-center justify-between">
                <div className="ml-80 flex items-center space-x-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        ) : (
                            <img
                                src="https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face"
                                alt="Profile"
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h1 className="mb-1 text-2xl font-bold">
                            {user.name || 'ชื่อ นามสกุล'}
                        </h1>
                        <p className="mb-1 text-lg opacity-90">
                            {user.position || 'ตำเเหน่งงาน'}
                        </p>
                        <p className="mb-1 text-sm opacity-80">
                            {user.email || 'name.00@gmail.com'}
                        </p>
                        <p className="text-sm opacity-80">
                            {user.phone || '092-123-4567'}
                        </p>
                    </div>
                </div>
                <div className="mr-80 text-right">
                    {/* "ช่อง" ที่จะแสดง UI ที่ถูกส่งเข้ามา */}
                    {actionsSlot}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
