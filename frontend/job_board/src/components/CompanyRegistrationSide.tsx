import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface CompanyProfile {
    province: string | null;
    registrationNumber: string | null;
    legalName: string | null;
    companyType: string | null;
    businessTypeName: string | null;
    registeredCapital: number | null;
}

interface CompanyRegistrationSideProps {
    currentProfile: CompanyProfile | null;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const CompanyRegistrationSide: React.FC<CompanyRegistrationSideProps> = ({
    currentProfile,
    onUpdate,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        province: '',
        registrationNumber: '',
        legalName: '',
        companyType: '',
        businessTypeName: '',
        registeredCapital: '',
    });

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                province: currentProfile.province || '',
                registrationNumber: currentProfile.registrationNumber || '',
                legalName: currentProfile.legalName || '',
                companyType: currentProfile.companyType || '',
                businessTypeName: currentProfile.businessTypeName || '',
                registeredCapital: currentProfile.registeredCapital?.toString() || '',
            });
        }
    }, [currentProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // เรายังคงใช้ API endpoint เดิม เพราะมันสามารถอัปเดตข้อมูลบางส่วนได้
            const response = await api.put('/profiles/company/me', formData);
            toast.success('อัปเดตข้อมูลทางทะเบียนสำเร็จ!');
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to update company registration info:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
            <h1 className="text-2xl font-bold">แก้ไขข้อมูลทางทะเบียน</h1>
            <div className="mt-6 flex-grow space-y-4 overflow-y-auto pr-4">
                <div>
                    <label>ชื่อนิติบุคคล</label>
                    <input name="legalName" value={formData.legalName} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>เลขทะเบียนนิติบุคคล</label>
                    <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                 <div>
                    <label>ประเภทนิติบุคคล</label>
                    <input name="companyType" value={formData.companyType} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                 <div>
                    <label>ชื่อประเภทธุรกิจ</label>
                    <input name="businessTypeName" value={formData.businessTypeName} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>จังหวัด</label>
                    <input name="province" value={formData.province} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
                <div>
                    <label>ทุนจดทะเบียน (บาท)</label>
                    <input type="number" name="registeredCapital" value={formData.registeredCapital} onChange={handleChange} className="mt-1 w-full rounded-lg border-2 p-2"/>
                </div>
            </div>
            <div className="mt-auto flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold">ยกเลิก</button>
                <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white">บันทึก</button>
            </div>
        </form>
    );
};

export default CompanyRegistrationSide;