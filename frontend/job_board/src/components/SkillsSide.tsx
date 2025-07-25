import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Skill {
    name: string;
    level: number;
}

interface SkillsSideProps {
    currentSkills: Skill[];
    desiredPosition: string | null;
    onUpdate: (newProfile: any) => void;
    onClose: () => void;
}

const SkillsSide: React.FC<SkillsSideProps> = ({ currentSkills, desiredPosition, onUpdate, onClose }) => {
    const [step, setStep] = useState(1); // 1: Loading/Select, 2: Rate
    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});
    const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const initializeState = () => {
        const initialSelected: Record<string, boolean> = {};
        const initialLevels: Record<string, number> = {};
        currentSkills.forEach(skill => {
            initialSelected[skill.name] = true;
            initialLevels[skill.name] = skill.level;
        });
        setSelectedSkills(initialSelected);
        setSkillLevels(initialLevels);

        // ถ้ามี Skill อยู่แล้ว ให้ไปที่หน้าประเมินระดับเลย
        if (currentSkills.length > 0) {
            setStep(2);
        } else if (desiredPosition) {
            // ถ้ายังไม่มี Skill แต่มี desiredPosition ให้ไปถาม AI
            setIsLoading(true);
            setError(null);
            api.post('/ai/suggest-skills', { position: desiredPosition })
                .then(response => {
                    const skills = response.data.skills || [];
                    if (skills.length === 0) {
                        setError("AI ไม่สามารถให้คำแนะนำสำหรับตำแหน่งนี้ได้ ลองเพิ่มทักษะด้วยตนเอง");
                    }
                    setSuggestedSkills(skills);
                })
                .catch(err => {
                    console.error("AI suggestion failed:", err);
                    setError("เกิดข้อผิดพลาดในการขอคำแนะนำจาก AI"); // กำหนดข้อความ Error
                })
                .finally(() => setIsLoading(false));
            setStep(1);
        } else {
            setStep(2);
        }
    };

    //เรียกใช้ initializeState เมื่อเปิด Sidebar
    useEffect(() => {
        initializeState();
    }, [currentSkills, desiredPosition]);


    //จัดการการทำงานของฟอร์ม
    const handleSkillToggle = (skillName: string) => {
        setSelectedSkills(prev => ({ ...prev, [skillName]: !prev[skillName] }));
        if (!selectedSkills[skillName]) {
            setSkillLevels(prev => ({ ...prev, [skillName]: 5 }));
        }
    };

    //ฟังก์ชันเพิ่มสกิลที่พิมพ์เอง
    const handleAddNewSkill = () => {
        if (newSkillName.trim() && !selectedSkills[newSkillName.trim()]) {
            const skillToAdd = newSkillName.trim();
            setSelectedSkills(prev => ({ ...prev, [skillToAdd]: true }));
            setSkillLevels(prev => ({ ...prev, [skillToAdd]: 5 }));
            setNewSkillName(''); // ล้างช่อง input
        }
    };

    //โฟังก์ชันลบสกิลทีละอัน
    const handleDeleteSkill = (skillNameToDelete: string) => {
        setSelectedSkills(prev => {
            const newSelected = { ...prev };
            delete newSelected[skillNameToDelete];
            return newSelected;
        });
        setSkillLevels(prev => {
            const newLevels = { ...prev };
            delete newLevels[skillNameToDelete];
            return newLevels;
        });
    };
    
    // ฟังก์ชันล้างทั้งหมด
    const handleClearAll = () => {
        setSelectedSkills({});
        setSkillLevels({});
        setSuggestedSkills([]);
        if (desiredPosition) {
             // ถ้ามี desiredPosition ให้ไปถาม AI อีกครั้ง
             setIsLoading(true);
             api.post('/ai/suggest-skills', { position: desiredPosition })
                 .then(response => setSuggestedSkills(response.data.skills || []))
                 .catch(error => console.error("AI suggestion failed:", error))
                 .finally(() => setIsLoading(false));
            setStep(1);
        } else {
            setStep(2);
        }
    }

    const handleLevelChange = (skillName: string, level: number) => {
        setSkillLevels(prev => ({ ...prev, [skillName]: level }));
    };

    const handleSaveSkills = async () => {
        setIsLoading(true);
        const skillsToSave = Object.entries(selectedSkills)
            .filter(([, isSelected]) => isSelected)
            .map(([name]) => ({ name, rating: skillLevels[name] || 5 }));

        try {
            const response = await api.put('/profiles/candidate/me/skills', { skills: skillsToSave });
            onUpdate(response.data);
            toast.success("บันทึกทักษะสำเร็จ!");
            onClose();
        } catch (error) {
            console.error("Failed to save skills:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const finalSelectedSkills = Object.keys(selectedSkills).filter(key => selectedSkills[key]);

    // --- ส่วนการแสดงผล (Render) ---
    return (
        <div className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">เพิ่ม/แก้ไขทักษะ</h1>
            
            {/* Step 1: เลือกจาก AI */}
            {step === 1 && (
                <div className="mt-4 flex flex-col flex-grow overflow-y-auto">
                    {isLoading ? <p>AI กำลังค้นหา...</p> : (
                        <>
                            <p className="font-bold">ทักษะที่แนะนำสำหรับ "{desiredPosition}"</p>
                            {error && <p className="text-red-500 text-center my-4 p-3 bg-red-50 rounded-lg">{error}</p>}
                            <div className="mt-2 space-y-2">
                                {suggestedSkills.map(skill => (
                                    <label key={skill} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                        <input type="checkbox" checked={!!selectedSkills[skill]} onChange={() => handleSkillToggle(skill)} className="h-5 w-5"/>
                                        <span>{skill}</span>
                                    </label>
                                ))}
                            </div>
                            <button onClick={() => setStep(2)} className="mt-auto w-full bg-teal-600 text-white rounded-lg py-3 font-bold">
                                ไปยังหน้าประเมินระดับ
                            </button>
                        </>
                    )}
                </div>
            )}
            
            {/* Step 2: ประเมิน, เพิ่ม, ลบ */}
            {step === 2 && (
                <div className="mt-4 flex flex-col flex-grow overflow-y-auto pr-4">
                     {/* ส่วนเพิ่มสกิลเอง */}
                     <div className="mb-6">
                        <label className="font-bold">เพิ่มทักษะด้วยตนเอง</label>
                        <div className="flex gap-2 mt-2">
                            <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="เช่น HTML, Python, Canva" className="flex-grow border-2 rounded-lg p-3" />
                            <button onClick={handleAddNewSkill} className="bg-teal-500 text-white px-4 rounded-lg font-bold">เพิ่ม</button>
                        </div>
                     </div>
                     
                     <p className="font-bold mb-4">ประเมินระดับความเชี่ยวชาญ (1-10)</p>
                     {finalSelectedSkills.length > 0 ? (
                        <div className="space-y-4">
                            {finalSelectedSkills.map(skill => (
                                <div key={skill} className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-1"><label className="font-semibold">{skill}</label><span className="text-teal-600 font-bold">{skillLevels[skill] || 5}/10</span></div>
                                        <input type="range" min="1" max="10" value={skillLevels[skill] || 5} onChange={(e) => handleLevelChange(skill, parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"/>
                                    </div>
                                    <button onClick={() => handleDeleteSkill(skill)} className="text-red-500 hover:text-red-700 p-2"><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-center text-gray-500 py-4">ยังไม่มีทักษะที่เลือก</p>
                     )}
                     
                     <div className="mt-auto flex justify-between items-center gap-4 border-t pt-6">
                        <button type="button" onClick={handleClearAll} disabled={isLoading} className="text-sm text-red-500 hover:underline">ล้างทั้งหมด</button>
                        <div className="flex gap-2">
                           <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-200 py-2 px-4 rounded-md font-semibold">ยกเลิก</button>
                           <button onClick={handleSaveSkills} disabled={isLoading} className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold disabled:bg-gray-400">
                                บันทึก
                           </button>
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default SkillsSide;