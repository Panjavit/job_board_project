import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface WorkHistoryFormData{
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}


interface WorkHistorySideProps{
    workHistoryItem: any | null;
    onUpdate: (updateProfile: any) => void; //ฟังก์ชันที่จะเรียกเมื่อข้อมูลอัปเดตสำเร็จ
    onClose: () => void; //ฟังก์ชันสำหรับปิด Sidebar
}

const WorkHistorySide: React.FC<WorkHistorySideProps> = ({ workHistoryItem, onUpdate, onClose }) => {
    const [formData, setFormData] = useState<WorkHistoryFormData>({
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const isEditing = workHistoryItem && workHistoryItem.id;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                companyName: workHistoryItem.companyName || '',
                position: workHistoryItem.position || '',
                //แปลง Format วันที่ให้ใช้กับ input type="date" ได้
                startDate: workHistoryItem.startDate ? new Date(workHistoryItem.startDate).toISOString().split('T')[0] : '',
                endDate: workHistoryItem.endDate ? new Date(workHistoryItem.endDate).toISOString().split('T')[0] : '',
                description: workHistoryItem.description || '',
            });
        }else{
            setFormData({
                companyName: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
            });
        }
    }, [workHistoryItem, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // ถ้าเป็นการแก้ไข, ใช้เมธอด PUT
                await api.put(`/work-history/${workHistoryItem.id}`, formData);
            } else {
                // ถ้าเป็นการสร้างใหม่, ใช้เมธอด POST
                await api.post('/work-history', formData);
            }
            
            // ดึงข้อมูลโปรไฟล์ล่าสุดมาอัปเดตหน้าเว็บ
            const response = await api.get('/profiles/candidate/me');
            onUpdate(response.data);
            alert('บันทึกข้อมูลสำเร็จ!');
            onClose();

        } catch (error) {
            console.error("Failed to save work history:", error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'แก้ไข' : 'เพิ่ม'}ประวัติการทำงาน</h1>
            
            <div className="flex-grow flex flex-col gap-4">
                <div>
                    <label htmlFor="position" className="text-lg font-bold">ตำแหน่งงาน</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="ตำแหน่ง..." className="mt-2 w-full rounded-lg border-2 border-stone-500 px-4 py-4"/>
                </div>
                <div>
                    <label htmlFor="companyName" className="text-lg font-bold">บริษัท</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="บริษัท..." className="mt-2 w-full rounded-lg border-2 border-stone-500 px-4 py-4"/>
                </div>
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                        <label htmlFor="startDate" className="text-lg font-bold">วันที่เริ่ม</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-2 w-full rounded-lg border-2 border-stone-500 px-4 py-4"/>
                    </div>
                     <div className='w-1/2'>
                        <label htmlFor="endDate" className="text-lg font-bold">วันที่สิ้นสุด</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-2 w-full rounded-lg border-2 border-stone-500 px-4 py-4"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="text-lg font-bold">รายละเอียดการทำงาน</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="รายละเอียด..." className="mt-2 w-full min-h-[200px] rounded-lg border-2 border-stone-500 px-4 py-4"/>
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

export default WorkHistorySide;