// components/SkillsCard.tsx
import React, { useState } from 'react';
 

interface SkillsCardProps {
  skills: Skill[];
  onUpdateSkills: (skills: Skill[]) => void;
}
 interface Skill {
  name: string;
  level: number;
}


const SkillsCard: React.FC<SkillsCardProps> = ({ skills, onUpdateSkills }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSkills, setEditSkills] = useState<Skill[]>(skills);
  const [newSkillName, setNewSkillName] = useState<string>('');

  const handleSave = (): void => {
    onUpdateSkills(editSkills);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditSkills(skills);
    setNewSkillName('');
    setIsEditing(false);
  };

  const handleSkillChange = (index: number, newLevel: string): void => {
    const updatedSkills = [...editSkills];
    updatedSkills[index] = { ...updatedSkills[index], level: parseInt(newLevel) };
    setEditSkills(updatedSkills);
  };

  const addNewSkill = (): void => {
    if (newSkillName.trim()) {
      setEditSkills([...editSkills, { name: newSkillName.trim(), level: 5 }]);
      setNewSkillName('');
    }
  };

  const removeSkill = (index: number): void => {
    const updatedSkills = editSkills.filter((_, i) => i !== index);
    setEditSkills(updatedSkills);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 text-base">สกิล</h3>
        <div className="mb-4">
          <div className="space-y-4">
            {editSkills.map((skill, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{skill.level}/10</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-500 text-xs hover:text-red-700"
                      type="button"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skill.level}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSkillChange(index, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkillName(e.target.value)}
                  placeholder="เพิ่มทักษะใหม่ เช่น HTML , python , canva"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={addNewSkill}
                  className="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600"
                  type="button"
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleSave}
            className="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600"
            type="button"
          >
            บันทึก
          </button>
          <button 
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            type="button"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-base">สกิล</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="font-bold">{skill.level}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={
                    skill.level >= 8 ? 'h-2 rounded-full bg-green-500' : 
                    skill.level >= 6 ? 'h-2 rounded-full bg-yellow-400' : 'h-2 rounded-full bg-orange-400'
                  }
                  style={{ width: (skill.level / 10) * 100 + '%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => setIsEditing(true)}
        className="text-teal-500 text-sm border border-teal-500 px-4 py-2 rounded hover:bg-teal-50"
        type="button"
      >
        แก้ไข →
      </button>
    </div>
  );
};

export default SkillsCard;