import React, { useState } from 'react';
import api from '../services/api';

interface CertificateSideProps {
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const CertificateSide: React.FC<CertificateSideProps> = ({ onUpdate, onClose }) => {
    const [description, setDescription] = useState('');
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
            alert('กรุณาเลือกไฟล์');
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        try {
            await api.post('/certificate-files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('เพิ่มรางวัล/ใบประกาศสำเร็จ!');
            const response = await api.get('/profiles/candidate/me');
            onUpdate(response.data);
            onClose();

        } catch (error) {
            console.error("Failed to upload certificate:", error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">เพิ่มรางวัลหรือประกาศนียบัตร</h1>
            <div className="flex-grow flex flex-col gap-6 mt-6">
                <div>
                    <label className="text-lg font-bold">อัปโหลดรูปภาพ/ไฟล์</label>
                    <div className="mt-2 flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                        <input type="file" onChange={handleFileChange} required className="text-sm" />
                    </div>
                    {file && <p className="text-sm text-gray-600 mt-2">ไฟล์ที่เลือก: {file.name}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="text-lg font-bold">รายละเอียด (ถ้ามี)</label>
                    <textarea
                        id="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="เช่น ชนะเลิศอันดับ 1 การแข่งขัน..."
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
            </div>
             <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} disabled={isUploading} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-semibold disabled:opacity-50">
                    ยกเลิก
                </button>
                <button type="submit" disabled={isUploading} className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-semibold disabled:opacity-50">
                    {isUploading ? 'กำลังอัปโหลด...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

export default CertificateSide;