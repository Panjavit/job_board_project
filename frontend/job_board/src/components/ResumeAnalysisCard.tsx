import React, { useState } from 'react';
import api from '../services/api';
import { FileUp, BrainCircuit, Loader2 } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import toast from 'react-hot-toast';

// ตั้งค่า Worker เพื่อให้ library ทำงานในเบราว์เซอร์ได้
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Skill {
    name: string;
    level: number;
}

interface ResumeAnalysisCardProps {
    onAnalysisComplete: (analyzedSkills: Skill[]) => void;
}

const ResumeAnalysisCard: React.FC<ResumeAnalysisCardProps> = ({ onAnalysisComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('กรุณาเลือกไฟล์ PDF เท่านั้น');
            e.target.value = ''; // รีเซ็ตถ้าไฟล์ไม่ใช่ PDF
            return;
        }

        setIsAnalyzing(true);
        try {
            const arrayBuffer = await file.arrayBuffer(); // อ่านไฟล์เป็น ArrayBuffer

            const pdfData = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdfData.numPages; i++) {
                const page = await pdfData.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => (item as any).str).join(' ');
                fullText += pageText + '\n';
            }

            // ส่งข้อความไปให้ Backend
            const response = await api.post('/ai/analyze-text', { resumeText: fullText });
            
            const skills = response.data.skills.map((s: { name: string; rating: number }) => ({
                name: s.name,
                level: s.rating,
            }));

            toast.success('วิเคราะห์ทักษะสำเร็จ!');
            onAnalysisComplete(skills);

        } catch (error) {
            console.error("PDF processing or API call failed:", error);
            toast.error("เกิดข้อผิดพลาดในการวิเคราะห์ไฟล์ PDF");
        } finally {
            setIsAnalyzing(false);
            e.target.value = '';
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-800">วิเคราะห์ทักษะด้วย AI</h3>
            <label className={`relative flex min-h-[96px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isAnalyzing ? 'border-gray-300 bg-gray-100' : 'border-gray-400 hover:border-teal-500'}`}>
                <FileUp className={`h-8 w-8 ${isAnalyzing ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`mt-2 text-sm font-semibold ${isAnalyzing ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isAnalyzing ? "กำลังวิเคราะห์..." : 'คลิกเพื่อเลือกไฟล์และเริ่มวิเคราะห์'}
                </p>
                <input
                    type="file"
                    className="absolute inset-0 h-full w-full opacity-0"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isAnalyzing}
                />
            </label>
        </div>
    );
};

export default ResumeAnalysisCard;