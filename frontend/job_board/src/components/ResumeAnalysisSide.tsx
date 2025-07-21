import React, { useState } from 'react';
import api from '../services/api';
import { Upload, BrainCircuit } from 'lucide-react';

interface Skill {
    name: string;
    level: number;
}

interface ResumeAnalysisSideProps {
    onAnalysisComplete: (analyzedSkills: Skill[]) => void;
    onClose: () => void;
}

const ResumeAnalysisSide: React.FC<ResumeAnalysisSideProps> = ({ onAnalysisComplete, onClose }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedSkills, setAnalyzedSkills] = useState<Skill[] | null>(null);

    const handleFileAnalyze = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalyzedSkills(null); // Clear previous results
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/ai/analyze-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const skills = response.data.skills.map((s: { name: string; rating: number }) => ({
                name: s.name,
                level: s.rating,
            }));
            setAnalyzedSkills(skills);
            
        } catch (error) {
            console.error("PDF analysis failed:", error);
            alert("เกิดข้อผิดพลาดในการวิเคราะห์ไฟล์ PDF");
        } finally {
            setIsAnalyzing(false);
            e.target.value = ''; // Reset file input
        }
    };

    const handleConfirmSkills = () => {
        if (analyzedSkills) {
            onAnalysisComplete(analyzedSkills);
            onClose();
        }
    };

    return (
        <div className="flex h-full w-full flex-col">
            <h1 className="text-2xl font-bold">วิเคราะห์ทักษะจากไฟล์ PDF</h1>
            <p className="text-sm text-gray-500 mt-1">อัปโหลดไฟล์ Resume หรือ CV ของคุณเพื่อให้ AI ช่วยประเมินทักษะเบื้องต้น</p>

            <div className="my-6">
                <label 
                    htmlFor="resume-analyzer-input" 
                    className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center font-semibold transition-colors ${isAnalyzing ? 'border-gray-300 bg-gray-100 text-gray-400' : 'border-gray-400 text-gray-600 hover:border-teal-500 hover:text-teal-600'}`}
                >
                    <Upload size={32} />
                    <span>{isAnalyzing ? "กำลังวิเคราะห์..." : "เลือกไฟล์ PDF เพื่อวิเคราะห์"}</span>
                </label>
                <input id="resume-analyzer-input" type="file" className="hidden" accept=".pdf" onChange={handleFileAnalyze} disabled={isAnalyzing} />
            </div>

            <div className="flex-grow space-y-2 overflow-y-auto pr-2 border-t pt-4">
                <h2 className="font-bold text-lg">ผลการวิเคราะห์:</h2>
                {analyzedSkills ? (
                    analyzedSkills.length > 0 ? (
                        analyzedSkills.map(skill => (
                            <div key={skill.name} className="flex items-center justify-between rounded-md bg-gray-100 p-2">
                                <span className="font-semibold">{skill.name}</span>
                                <span className="font-bold text-teal-600">{skill.level}/10</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-center text-gray-500 py-4">ไม่พบทักษะที่เกี่ยวข้องในไฟล์</p>
                    )
                ) : (
                     <p className="text-sm text-center text-gray-500 py-4">โปรดอัปโหลดไฟล์เพื่อเริ่มการวิเคราะห์</p>
                )}
            </div>
            
            <div className="mt-auto flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800">ยกเลิก</button>
                <button 
                    onClick={handleConfirmSkills} 
                    disabled={!analyzedSkills || analyzedSkills.length === 0} 
                    className="flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
                >
                    <BrainCircuit size={16}/>
                    ยืนยันและเพิ่มทักษะเหล่านี้
                </button>
            </div>
        </div>
    );
};

export default ResumeAnalysisSide;