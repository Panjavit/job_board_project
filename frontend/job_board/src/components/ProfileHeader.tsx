// components/ProfileHeader.tsx
import React, { useState } from 'react';
import api from '../services/api';

interface ProfileHeaderProps {
    user: CandidatProfile;
    completionRate: number;
    onEditClick: () => void;
    onSave: (data: {
        name: string;
        phone: string;
        profileImage: string;
    }) => void;
    onProfileUpdate: () => void;
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
    customSkills: Skill[];
    videoUrl: string | null;
    profileImage: string;
    certificateFiles: FileData[];
    contactFiles: FileData[];
}
interface Skill {
    name: string;
    level: number;
}
interface FileData {
    name: string;
    url: string;
    type: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    completionRate,
    onEditClick,
    onSave,
    onProfileUpdate
}) => {
    const [isEditingHeader, setIsEditingHeader] = useState<boolean>(false);
    const [tempData, setTempData] = useState({
        name: user.name || '',
        position: user.position || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
    });

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        // แสดง Preview รูปที่กำลังจะอัปโหลด (เหมือนเดิม)
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target?.result) {
                setTempData(prev => ({
                    ...prev,
                    profileImage: event.target!.result as string,
                }));
            }
        };
        reader.readAsDataURL(file);

        // ทำการอัปโหลดไฟล์ไปที่ Backend
        const formData = new FormData();
        formData.append('file', file); // ตั้งชื่อ field ว่า 'file' ให้ตรงกับที่ backend กำหนด

        try {
            await api.post('/profiles/candidate/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('อัปโหลดรูปโปรไฟล์ใหม่สำเร็จ!');
            // เมื่ออัปโหลดสำเร็จ ให้เรียกฟังก์ชันเพื่อดึงข้อมูลโปรไฟล์ใหม่ทั้งหมด
            onProfileUpdate();
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        }
    };

    const handleSave = (): void => {
        onSave(tempData);
        setIsEditingHeader(false);
    };

    const handleCancel = (): void => {
        setTempData({
            name: user.name || '',
            position: user.position || '',
            email: user.email || '',
            phone: user.phone || '',
            profileImage: user.profileImage || '',
        });
        setIsEditingHeader(false);
    };

    if (isEditingHeader) {
        return (
            <div className="h-[200px] bg-gradient-to-r from-blue-900 to-purple-700 p-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 pl-30">
                        <div className="group relative flex h-30 w-30 items-center justify-center rounded-lg bg-white">
                            {tempData.profileImage ? (
                                <img
                                    src={tempData.profileImage}
                                    alt="Profile"
                                    className="h-20 w-20 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="mb-2 text-4xl">😊</div>
                                </div>
                            )}
                            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-100">
                                <label className="cursor-pointer text-center text-xs text-white">
                                    เปลี่ยนรูป
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pl-20">
                            <input
                                type="text"
                                value={tempData.name}
                                onChange={e =>
                                    setTempData(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-80 rounded-full bg-white px-3 py-2 text-lg text-gray-800"
                                placeholder="ชื่อ-นามสกุล"
                            />
                            <p className="w-80 rounded-full bg-white px-3 py-2 text-lg text-gray-800">
                                {user.position}
                            </p>
                            <p className="w-80 rounded-full bg-white px-3 py-2 text-lg text-gray-800">
                                {user.email}
                            </p>
                            <input
                                type="tel"
                                value={tempData.phone}
                                onChange={e =>
                                    setTempData(prev => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                className="w-80 rounded-full bg-white px-3 py-2 text-lg text-gray-800"
                                placeholder="เบอร์โทรศัพท์"
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="mb-2 text-sm opacity-90">
                            ความสมบูรณ์ของโปรไฟล์
                        </p>
                        <div className="mb-4">
                            <div className="mb-2 h-2 w-48 rounded-full bg-gray-300">
                                <div
                                    className="h-2 rounded-full bg-teal-400 transition-all duration-300"
                                    style={{ width: completionRate + '%' }}
                                ></div>
                            </div>
                            <p className="text-right text-sm font-bold">
                                {completionRate}%
                            </p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={handleSave}
                                className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                บันทึก
                            </button>
                            <button
                                onClick={handleCancel}
                                className="rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
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
                    <p className="mb-2 text-sm opacity-90">
                        ความสมบูรณ์ของโปรไฟล์
                    </p>
                    <div className="mb-4">
                        <div className="mb-2 h-2 w-48 rounded-full bg-gray-300">
                            <div
                                className="h-2 rounded-full bg-teal-400 transition-all duration-300"
                                style={{ width: completionRate + '%' }}
                            ></div>
                        </div>
                        <p className="text-right text-sm font-bold">
                            {completionRate}%
                        </p>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => setIsEditingHeader(true)}
                            className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                        >
                            แก้ไขข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
