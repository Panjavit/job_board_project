import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface CompanyProfile {
    companyName: string;
    about: string | null;
    contactInstructions: string;
    location: string | null;
    recruiterName: string | null;
    recruiterPosition: string | null;
    additionalContactInfo: string | null;
    province: string | null;
    registrationNumber: string | null;
    legalName: string | null;
    companyType: string | null;
    businessTypeName: string | null;
    registeredCapital: number | null;
}

interface CompanyInfoSideProps {
    currentProfile: CompanyProfile | null;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const CompanyInfoSide: React.FC<CompanyInfoSideProps> = ({
    currentProfile,
    onUpdate,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        companyName: '',
        about: '',
        contactInstructions: '',
        location: '',
        recruiterName: '',
        recruiterPosition: '',
    });

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                companyName: currentProfile.companyName || '',
                about: currentProfile.about || '',
                contactInstructions: currentProfile.contactInstructions || '',
                location: currentProfile.location || '',
                recruiterName: currentProfile.recruiterName || '',
                recruiterPosition: currentProfile.recruiterPosition || '',
            });
        }
    }, [currentProfile]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.put('/profiles/company/me', formData);
            alert('อัปเดตข้อมูลบริษัทสำเร็จ!');
            onUpdate(response.data); //ส่งข้อมูลใหม่กลับไปอัปเดตหน้าหลัก
            onClose();
        } catch (error) {
            console.error('Failed to update company profile:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
            <h1 className="text-2xl font-bold">แก้ไขข้อมูลบริษัท</h1>
            <div className="mt-6 flex-grow space-y-4 overflow-y-auto pr-4">
                <h2 className="border-b pb-2 text-lg font-bold text-gray-700">ข้อมูลทั่วไป</h2>
                <div>
                    <label>ชื่อบริษัท</label>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>เกี่ยวกับบริษัท</label>
                    <textarea name="about" rows={4} value={formData.about} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>สถานที่ทำงาน (ที่อยู่เต็ม)</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>

                <h2 className="mt-6 border-b pb-2 text-lg font-bold text-gray-700">ข้อมูลผู้ติดต่อ</h2>
                <div>
                    <label>ชื่อผู้รับผิดชอบ</label>
                    <input name="recruiterName" value={formData.recruiterName} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>ตำแหน่ง</label>
                    <input name="recruiterPosition" value={formData.recruiterPosition} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
            </div>
            <div className="mt-auto flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold">ยกเลิก</button>
                <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white">บันทึก</button>
            </div>
        </form>
    );
};

export default CompanyInfoSide;