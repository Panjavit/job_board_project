import React from 'react';


interface ProfileCardProps {
  title: string;
  content: string | null | undefined; // เนื้อหาที่จะแสดง (อาจจะเป็น null)
  placeholder: string; 
  onEditClick: () => void; //ถูกเรียกเมื่อกดปุ่ม "เพิ่ม" หรือ "แก้ไข"
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, content, placeholder, onEditClick }) => {
  //ตรวจสอบว่ามีเนื้อหาจริงหรือไม่
  const hasContent = content && content.trim() !== '';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 text-base">{title}</h3>
      
      {hasContent ? (
        <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[96px]">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
          <button
            onClick={onEditClick}
            className="absolute top-3 right-3 bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-teal-600 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label={`แก้ไข ${title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-3">{placeholder}</p>
          <button
            onClick={onEditClick}
            className="text-teal-500 text-sm border border-teal-500 px-4 py-2 rounded hover:bg-teal-50 transition-colors"
          >
            เพิ่มข้อมูล →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;