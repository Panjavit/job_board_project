import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface InternshipApplicationSideProps {
    currentProfile: any | null;
    onClose: () => void;
    onUpdate: (newProfile: any) => void;
}

const InternshipApplicationSide: React.FC<InternshipApplicationSideProps> = ({ currentProfile, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        positionOfInterest: '',
        universityName: '',
        startDate: '',
        endDate: '',
        reason: '',
        internshipType: 'INTERNSHIP',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        //เมื่อมี currentApplication ถูกส่งเข้ามา (ตอนกดแก้ไข)
        if (currentProfile) {
            setFormData({
                positionOfInterest: currentProfile.positionOfInterest || '',
                universityName: currentProfile.universityName || '',
                startDate: currentProfile.startDate ? new Date(currentProfile.startDate).toISOString().split('T')[0] : '',
                endDate: currentProfile.endDate ? new Date(currentProfile.endDate).toISOString().split('T')[0] : '',
                reason: currentProfile.reason || '',
                internshipType: currentProfile.internshipType || 'INTERNSHIP',
            });
        }
    }, [currentProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/applications`, formData);
            toast.success('บันทึกข้อมูลการสมัครฝึกงานเรียบร้อย!');
            
            const response = await api.get('/profiles/candidate/me');
            onUpdate(response.data);

            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งใบสมัคร';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold">รายละเอียดของการฝึกงาน</h1>
            <div className="flex-grow flex flex-col gap-4 mt-6 overflow-y-auto pr-4">
                <div>
                    <label htmlFor="positionOfInterest" className="font-bold">ตำแหน่งงานที่สนใจ</label>
                    <input type="text" name="positionOfInterest" value={formData.positionOfInterest} onChange={handleChange} required className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"/>
                </div>
                <div>
                    <label htmlFor="internshipType" className="font-bold">รูปแบบการฝึกงาน</label>
                    <select
                        name="internshipType"
                        id="internshipType"
                        value={formData.internshipType}
                        onChange={handleChange}
                        required
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3 bg-white"
                    >
                        <option value="INTERNSHIP">ฝึกงาน (Internship)</option>
                        <option value="FULL_TIME">พนักงานประจำ (Full-time)</option>
                        <option value="PART_TIME">พาร์ทไทม์ (Part-time)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="universityName" className="font-bold">ชื่อมหาวิทยาลัย / สถานศึกษา</label>
                    <input type="text" name="universityName" value={formData.universityName} onChange={handleChange} required className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"/>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label htmlFor="startDate" className="font-bold">วันที่เริ่ม</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"/>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="endDate" className="font-bold">วันที่สิ้นสุด</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="reason" className="font-bold">เหตุผลที่อยากฝึกงานกับเรา</label>
                    <textarea name="reason" rows={6} value={formData.reason} onChange={handleChange} required className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"/>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-semibold disabled:opacity-50">
                    ยกเลิก
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-semibold disabled:opacity-50">
                    {isSubmitting ? 'กำลังส่ง...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

export default InternshipApplicationSide;