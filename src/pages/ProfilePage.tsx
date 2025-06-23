import React, { useState } from 'react';
import {
  ProfileHeader,
  ProfileCard,
  SkillsCard,
  FileUploadCard,
  VideoUploadCard,
  
} from '../components';
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

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    position: '',
    company: '',
    skills: '',
    email: '',
    phone: '',
    about: 'เพิ่มข้อมูลส่วนตัวของคุณ',
    experience: 'เพิ่มประวัติการทำงานเพื่อให้บริษัททราบถึงประสบการณ์ของคุณ',
    education: 'แจ้งให้บริษัททราบเกี่ยวกับข้อมูลการศึกษาของคุณ',
    projects: 'แสดงข้อมูลทีเกี่ยวข้องเพิ่มใบอนุญาตหรือประกาศนียบัตรที่เกี่ยวข้องกับงาน',
    achievements: 'เพิ่มรายละเอียดการฝึกงานเพื่อบอกว่าคุณต้องการฝึกเป็นเวลานานเท่าใด',
    customSkills: [
      
    ],
    videoUrl: null,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150&h=150&fit=crop&crop=face',
    certificateFiles: [],
    contactFiles: []
  });

  const handleUpdateProfile = (profileData: Partial<UserData>): void => {
    setUserData(prev => ({
      ...prev,
      ...profileData
    }));
  };

  const handleUpdateCard = (cardId: string, content: string): void => {
    setUserData(prev => ({
      ...prev,
      [cardId]: content
    }));
  };

  const handleUpdateSkills = (newSkills: Skill[]): void => {
    setUserData(prev => ({
      ...prev,
      customSkills: newSkills
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoURL = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, videoUrl: videoURL }));
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileData: FileData[] = fileArray.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setUserData(prev => ({ 
        ...prev, 
        certificateFiles: [...prev.certificateFiles, ...fileData] 
      }));
    }
  };

  const handleContactFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileData: FileData[] = fileArray.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setUserData(prev => ({ 
        ...prev, 
        contactFiles: [...prev.contactFiles, ...fileData] 
      }));
    }
  };

  const removeCertificateFile = (index: number): void => {
    const updatedFiles = userData.certificateFiles.filter((_, i) => i !== index);
    setUserData(prev => ({ ...prev, certificateFiles: updatedFiles }));
  };

  const removeContactFile = (index: number): void => {
    const updatedFiles = userData.contactFiles.filter((_, i) => i !== index);
    setUserData(prev => ({ ...prev, contactFiles: updatedFiles }));
  };

  const calculateCompletionRate = (): number => {
    const fields: (keyof UserData)[] = ['name', 'position', 'email', 'phone', 'about', 'experience'];
    const filledFields = fields.filter(field => {
      const value = userData[field];
      return typeof value === 'string' && value.trim() !== '';
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const skills = userData.customSkills || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader 
        user={userData} 
        completionRate={calculateCompletionRate()} 
        onUpdateProfile={handleUpdateProfile}

      />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProfileCard 
              title="ข้อมูลส่วนตัวของคุณ" 
              content={userData.about || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} 
              onEdit={handleUpdateCard}
              cardId="about"
            />
            
            <ProfileCard 
              title="ประสบการณ์การทำงานของคุณ" 
              content={userData.experience || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} 
              onEdit={handleUpdateCard}
              cardId="experience"
            />
            
            <ProfileCard 
              title="ข้อมูลการศึกษา" 
              content={userData.education || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} 
              onEdit={handleUpdateCard}
              cardId="education"
            />
            
            <FileUploadCard
              title="รางวัลหรือใบประกาศนียบัตร"
              files={userData.certificateFiles}
              onFileUpload={handleCertificateUpload}
              onRemoveFile={removeCertificateFile}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
          
          <div className="space-y-6">
            <VideoUploadCard 
              videoUrl={userData.videoUrl}
              onVideoUpload={handleVideoUpload}
            />

            <FileUploadCard
              title="เรซูเม่"
              files={userData.contactFiles}
              onFileUpload={handleContactFileUpload}
              onRemoveFile={removeContactFile}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            
            <SkillsCard skills={skills} onUpdateSkills={handleUpdateSkills} />

            <ProfileCard 
              title="ผลงาน/โปรเจค" 
              content={userData.projects || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} 
              onEdit={handleUpdateCard}
              cardId="projects"
            />
            
            <ProfileCard 
              title="รายละเอียดเพิ่มเติม" 
              content={userData.achievements || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."} 
              onEdit={handleUpdateCard}
              cardId="achievements"
            />
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default ProfilePage;