import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ProfileHeaderProps {
    user: CandidatProfile;
    completionRate?: number;
    onSave?: (data: { name: string; phone: string }) => void;
    onProfileUpdate?: () => void;
    actionsSlot?: React.ReactNode;
}

interface CandidatProfile {
    name: string;
    position: string;
    email: string;
    phone: string;
    profileImage: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    completionRate,
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

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/profiles/candidate/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('อัปโหลดรูปโปรไฟล์ใหม่สำเร็จ!');
            if (onProfileUpdate) onProfileUpdate();
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = (): void => {
        if (onSave) {
            onSave({ name: tempData.name, phone: tempData.phone });
        }
        setIsEditingHeader(false);
    };

    const handleCancel = (): void => {
        setIsEditingHeader(false);
    };

    if (isEditingHeader) {
        return (
            <div className="h-auto bg-gradient-to-r from-blue-900 to-purple-800 p-8 text-white transition-all duration-300 md:h-[200px]">
                <div className="mx-auto flex max-w-5xl items-center justify-center space-x-6">
                    <div className="relative h-24 w-24 flex-shrink-0">
                        <img
                            src={
                                tempData.profileImage ||
                                'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face'
                            }
                            alt="Profile"
                            className="h-full w-full rounded-lg object-cover"
                        />
                        <label
                            htmlFor="image-upload"
                            className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-blue-800 shadow-md hover:bg-gray-200"
                        >
                            <i className="fa-solid fa-camera"></i>
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                    <div className="w-full max-w-md space-y-3">
                        <input
                            type="text"
                            name="name"
                            value={tempData.name}
                            onChange={handleInputChange}
                            className="w-full rounded bg-white/20 px-3 py-2 text-xl font-bold placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
                            placeholder="ชื่อ-นามสกุล"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={tempData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded bg-white/20 px-3 py-2 text-sm placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
                            placeholder="เบอร์โทรศัพท์"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={handleSave}
                            className="w-20 rounded bg-teal-400 px-4 py-2 text-sm font-semibold text-black hover:bg-teal-300"
                        >
                            บันทึก
                        </button>
                        <button
                            onClick={handleCancel}
                            className="w-20 rounded bg-gray-600/50 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600/80"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-auto bg-gradient-to-r from-blue-900 to-purple-800 p-8 text-white transition-all duration-300 md:h-[200px]">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* ส่วนข้อมูลซ้าย */}
                <div className="flex items-center space-x-6">
                    <img
                        src={
                            user.profileImage ||
                            'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face'
                        }
                        alt="Profile"
                        className="h-28 w-28 rounded-lg object-cover"
                    />
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold">{user.name || 'ชื่อ นามสกุล'}</h1>
                        <p className="text-lg text-white/90">
                            {user.position || 'ตำแหน่งงาน'}
                        </p>
                        <p className="text-base text-white/80">
                            {user.email || 'name.00@gmail.com'}
                        </p>
                        <p className="text-base text-white/80">
                            {user.phone || '092-123-4567'}
                        </p>
                    </div>
                </div>

                {/* ส่วนข้อมูลขวา (ความสมบูรณ์ + ปุ่มแก้ไข) */}
                <div className="text-right">
                    {actionsSlot ? (
                        // ถ้ามี actionsSlot ส่งเข้ามา ให้แสดงผล actionsSlot
                        actionsSlot
                    ) : (
                        // ถ้าไม่มี ให้แสดงผล UI เริ่มต้น (ความสมบูรณ์ + ปุ่มแก้ไข)
                        <>
                            <p className="mb-2 text-sm font-semibold">
                                ความสมบูรณ์ของโปรไฟล์
                            </p>
                            <div className="mb-1 h-2 w-48 rounded-full bg-black/30">
                                <div
                                    className="h-2 rounded-full bg-teal-400"
                                    style={{ width: `${completionRate}%` }}
                                ></div>
                            </div>
                            <p className="mb-3 text-right text-sm font-bold">
                                {completionRate}%
                            </p>
                            <button
                                onClick={() => setIsEditingHeader(true)}
                                className="rounded-md border border-white/80 bg-black/40 px-5 py-2 font-semibold text-white transition-colors hover:bg-black/60"
                            >
                                แก้ไขข้อมูล
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
