import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface WorkDetailsSideProps {
    currentProfile: any;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const WorkDetailsSide: React.FC<WorkDetailsSideProps> = ({ currentProfile, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        workArrangement: 'ONSITE',
        workingDays: '',
        workingHours: '',
        workPolicy: '',
    });

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                workArrangement: currentProfile.workArrangement || 'ONSITE',
                workingDays: currentProfile.workingDays || '',
                workingHours: currentProfile.workingHours || '',
                workPolicy: currentProfile.workPolicy || '',
            });
        }
    }, [currentProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // เราจะส่งข้อมูลทั้งหมดไปอัปเดตที่ Endpoint เดิม
            const response = await api.put('/profiles/company/me', formData);
            toast.success('อัปเดตรายละเอียดการทำงานสำเร็จ!');
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to update work details:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
            <h1 className="text-2xl font-bold">รายละเอียดการทำงาน</h1>
            <div className="mt-6 flex-grow space-y-4 overflow-y-auto pr-4">
                <div>
                    <label>รูปแบบการทำงาน</label>
                    <select name="workArrangement" value={formData.workArrangement} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2 bg-white">
                        <option value="ONSITE">เข้าออฟฟิศ (On-site)</option>
                        <option value="HYBRID">ไฮบริด (Hybrid)</option>
                        <option value="REMOTE">ทำงานทางไกล (Remote)</option>
                    </select>
                </div>
                <div>
                    <label>วันทำงาน</label>
                    <input name="workingDays" value={formData.workingDays} onChange={handleChange} placeholder="เช่น จันทร์ - ศุกร์" className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>เวลาทำงาน</label>
                    <input name="workingHours" value={formData.workingHours} onChange={handleChange} placeholder="เช่น 09:00 - 18:00" className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>รายละเอียดเพิ่มเติม</label>
                    <textarea name="workPolicy" rows={5} value={formData.workPolicy} onChange={handleChange} placeholder="เช่น สามารถเข้าออฟฟิศสัปดาห์ละ 2 วัน, มี Flexible Hours, สถานที่ทำงานหลักคือ..." className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
            </div>
            <div className="mt-auto flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold">ยกเลิก</button>
                <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white">บันทึก</button>
            </div>
        </form>
    );
};

export default WorkDetailsSide;