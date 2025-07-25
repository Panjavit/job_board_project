import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface CompanyVideoSideProps {
    currentVideoUrl: string | null;
    onUpdate: () => void;
    onClose: () => void;
}

const CompanyVideoSide: React.FC<CompanyVideoSideProps> = ({ currentVideoUrl, onUpdate, onClose }) => {
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        setVideoUrl(currentVideoUrl || '');
    }, [currentVideoUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ใช้ API เดิมในการอัปเดตเฉพาะ videoUrl
            await api.put('/profiles/company/me', { videoUrl });
            toast.success('อัปเดตลิงก์วิดีโอสำเร็จ!');
            onUpdate(); // เรียก onUpdate เพื่อรีเฟรชข้อมูลหน้าหลัก
            onClose();
        } catch (error) {
            console.error("Failed to update video info:", error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">วิดีโอแนะนำบริษัท</h1>
            <p className="mt-2 text-sm text-gray-600">
                นำเสนอวัฒนธรรมองค์กร, บรรยากาศการทำงาน, หรือโปรเจกต์ที่น่าสนใจ เพื่อดึงดูดนักศึกษา
            </p>
            <div className="flex-grow flex flex-col gap-6 mt-6">
                <div>
                    <label htmlFor="videoUrl" className="text-lg font-bold">ลิงก์วิดีโอจาก YouTube</label>
                    <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-semibold">
                    ยกเลิก
                </button>
                <button type="submit" className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-semibold">
                    บันทึก
                </button>
            </div>
        </form>
    );
};

export default CompanyVideoSide;