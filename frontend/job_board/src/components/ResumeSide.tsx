import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ResumeSideProps {
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const ResumeSide: React.FC<ResumeSideProps> = ({ onUpdate, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('กรุณาเลือกไฟล์เรซูเม่ที่ต้องการอัปโหลด');
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // ส่งไฟล์ไปที่ API endpoint สำหรับเรซูเม่
            await api.post('/contact-files', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('เพิ่มไฟล์เรซูเม่สำเร็จ!');
            
            // ดึงข้อมูลโปรไฟล์ล่าสุดเพื่ออัปเดตหน้าเว็บ
            const response = await api.get('/profiles/candidate/me');
            onUpdate(response.data);
            onClose();

        } catch (error) {
            console.error("Failed to upload resume:", error);
            toast.error('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">เพิ่มไฟล์เรซูเม่</h1>
            
            <div className="flex-grow mt-8 flex flex-col justify-center">
                <label 
                    htmlFor="resume-upload" 
                    className="relative cursor-pointer bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col justify-center items-center h-48 text-center hover:border-teal-400"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400"></i>
                        <span className="mt-2 block text-sm font-semibold text-gray-600">
                            {file ? file.name : "คลิกเพื่ออัปโหลดไฟล์"}
                        </span>
                        <span className="text-xs text-gray-500">
                            PDF, DOC, DOCX
                        </span>
                    </div>
                    <input id="resume-upload" name="resume-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
                <button type="button" onClick={onClose} disabled={isUploading} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-semibold disabled:opacity-50">
                    ยกเลิก
                </button>
                <button type="submit" disabled={isUploading || !file} className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    {isUploading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

export default ResumeSide;