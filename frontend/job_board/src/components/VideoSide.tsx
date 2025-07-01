import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface VideoSideProps {
    currentProfile: any;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const VideoSide: React.FC<VideoSideProps> = ({ currentProfile, onUpdate, onClose }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoDescription, setVideoDescription] = useState('');

    useEffect(() => {
        if (currentProfile) {
            setVideoUrl(currentProfile.videoUrl || '');
            setVideoDescription(currentProfile.videoDescription || '');
        }
    }, [currentProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch('/profiles/candidate/me/personal-info', {
                videoUrl: videoUrl,
                videoDescription: videoDescription,
            });
            alert('อัปเดตข้อมูลวิดีโอสำเร็จ!');
            const response = await api.get('/profiles/candidate/me');
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error("Failed to update video info:", error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">เพิ่มวิดีโอแนะนำตัวเอง 5-10 นาที</h1>
            <li>ไปที่หน้าวิดีโอใน YouTube</li>
                <li>คลิกปุ่ม "แชร์" (Share)</li>
                <li>เลือก "ฝัง" (Embed)</li>
                <li>ในโค้ดที่ปรากฏขึ้นมา ให้คัดลอกเฉพาะ URL ที่อยู่ใน src="..."</li>
            <div className="flex-grow flex flex-col gap-6 mt-6">
                <div>
                    <label htmlFor="videoUrl" className="text-lg font-bold">ลิงก์วิดีโอ (อัปโหลดคลิปลง YouTube ตั้งค่าให้คนที่มีลิงค์สามารถดูได้)</label>
                    <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="เช่น https://www.youtube.com/watch?v=..."
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
                <div>
                    <label htmlFor="videoDescription" className="text-lg font-bold">คำอธิบายวิดีโอ</label>
                    <textarea
                        id="videoDescription"
                        name="videoDescription"
                        rows={5}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="อธิบายสั้นๆ เกี่ยวกับวิดีโอของคุณ"
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
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

export default VideoSide;