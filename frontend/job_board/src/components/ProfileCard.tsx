// components/ProfileCard.tsx
import React, { useState } from 'react';


 interface ProfileCardProps {
  title: string;
  content: string;
  onEdit: (cardId: string, content: string) => void;
  cardId: string;
}


const ProfileCard: React.FC<ProfileCardProps> = ({ title, content, onEdit, cardId }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(content);

  const handleSave = (): void => {
    onEdit(cardId, editContent);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditContent(content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 text-base">{title}</h3>
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder={'เพิ่ม' + title + 'ของคุณ'}
          />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleSave}
            className="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600"
          >
            บันทึก
          </button>
          <button 
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-base">{title}</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 min-h-24">
        <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
      </div>
      <button 
        onClick={() => setIsEditing(true)}
        className="text-teal-500 text-sm border border-teal-500 px-4 py-2 rounded hover:bg-teal-50"
      >
        แก้ไข →
      </button>
    </div>
  );
};

export default ProfileCard;