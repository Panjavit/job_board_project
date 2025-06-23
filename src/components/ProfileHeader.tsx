// components/ProfileHeader.tsx
import React, { useState } from 'react';
interface ProfileHeaderProps {
  user: UserData;
  completionRate: number;
  onUpdateProfile: (profileData: Partial<UserData>) => void;
}
interface UserData {
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

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, completionRate, onUpdateProfile }) => {
  const [isEditingHeader, setIsEditingHeader] = useState<boolean>(false);
  const [tempData, setTempData] = useState({
    name: user.name || '',
    position: user.position || '',
    email: user.email || '',
    phone: user.phone || '',
    profileImage: user.profileImage || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setTempData(prev => ({
            ...prev,
            profileImage: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (): void => {
    onUpdateProfile(tempData);
    setIsEditingHeader(false);
  };

  const handleCancel = (): void => {
    setTempData({
      name: user.name || '',
      position: user.position || '',
      email: user.email || '',
      phone: user.phone || '',
      profileImage: user.profileImage || ''
    });
    setIsEditingHeader(false);
  };

  if (isEditingHeader) {
    return (
      <div className="h-[200px]  bg-gradient-to-r from-blue-900 to-purple-700 text-white p-8 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 pl-30">
            <div className="w-30 h-30 bg-white rounded-lg flex items-center justify-center relative group">
              {tempData.profileImage ? (
                <img src={tempData.profileImage} alt="Profile" className="w-20 h-20 rounded-lg object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">😊</div>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer text-white text-xs text-center">
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
            <div className="space-y-3 pl-20">
              <input
                type="text"
                value={tempData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white text-gray-800 px-3 py-2 rounded-full text-lg w-80 "
                placeholder="ชื่อ-นามสกุล"
              />
              <input
                type="text"
                value={tempData.position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempData(prev => ({ ...prev, position: e.target.value }))}
                className="bg-white text-gray-800 px-3 py-2 rounded-full text-lg w-70"
                placeholder="ตำแหน่ง"
              />
              <input
                type="email"
                value={tempData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white text-gray-800 px-3 py-2 rounded-full text-lg w-80"
                placeholder="อีเมล"
              />
              <input
                type="tel"
                value={tempData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white text-gray-800 px-3 py-2 rounded-full text-lg w-70"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-2">ความสมบูรณ์ของโปรไฟล์</p>
            <div className="mb-4">
              <div className="w-48 h-2 bg-gray-300 rounded-full mb-2">
                <div 
                  className="h-2 bg-teal-400 rounded-full transition-all duration-300"
                  style={{ width: completionRate + '%' }}
                ></div>
              </div>
              <p className="text-right text-sm font-bold">{completionRate}%</p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
              >
                บันทึก
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700"
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
    <div className="h-[200px] bg-gradient-to-r from-blue-900 to-purple-700 text-white p-8 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 ml-80">
          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-lg object-cover" />
            ) : (
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face" alt="Profile" className="w-20 h-20 rounded-lg object-cover" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{user.name || 'ชื่อ นามสกุล'}</h1>
            <p className="text-lg opacity-90 mb-1">{user.position || 'ตำเเหน่งงาน'}</p>
            <p className="text-sm opacity-80 mb-1">{user.email || 'name.00@gmail.com'}</p>
            <p className="text-sm opacity-80">{user.phone || '092-123-4567'}</p>
          </div>
        </div>
        <div className="text-right mr-80">
          <p className="text-sm opacity-90 mb-2">ความสมบูรณ์ของโปรไฟล์</p>
          <div className="mb-4">
            <div className="w-48 h-2 bg-gray-300 rounded-full mb-2">
              <div 
                className="h-2 bg-teal-400 rounded-full transition-all duration-300"
                style={{ width: completionRate + '%' }}
              ></div>
            </div>
            <p className="text-right text-sm font-bold">{completionRate}%</p>
          </div>
          <div className="space-x-2">
            <button 
              onClick={() => setIsEditingHeader(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700"
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