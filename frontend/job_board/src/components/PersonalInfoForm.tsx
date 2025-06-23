import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface PersonalInfoFormProps {
    currentProfile: any;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ currentProfile, onUpdate, onClose }) => {
    // สร้าง state สำหรับเก็บข้อมูลในฟอร์ม
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: '',
        bio: '' // bio คือ "สิ่งที่คุณถนัด" หรือ "ข้อมูลส่วนตัวโดยย่อ"
    });

    // เมื่อ component โหลด, ให้นำค่าจากโปรไฟล์ปัจจุบันมาใส่ในฟอร์ม
    useEffect(() => {
        if (currentProfile) {
            // แยก fullName เป็น firstName และ lastName
            const [firstName = '', lastName = ''] = currentProfile.fullName?.split(' ') || [];

            setFormData({
                firstName: firstName,
                lastName: lastName,
                nickname: currentProfile.nickname || '',
                gender: currentProfile.gender || '',
                // แปลง format วันเกิด (ถ้ามี)
                dateOfBirth: currentProfile.dateOfBirth ? new Date(currentProfile.dateOfBirth).toISOString().split('T')[0] : '',
                phoneNumber: currentProfile.phoneNumber || '',
                bio: currentProfile.bio || '',
            });
        }
    }, [currentProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // รวมชื่อจริงและนามสกุลกลับเป็น fullName
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            const updatedData = {
                ...currentProfile,
                fullName: fullName,
                nickname: formData.nickname,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
                phoneNumber: formData.phoneNumber,
                bio: formData.bio,
            };

            const response = await api.patch('/profiles/candidate/me/personal-info', updatedData);

            alert('อัปเดตข้อมูลส่วนตัวสำเร็จ!');
            onUpdate(response.data);
            onClose();

        } catch (error) {
            console.error("Failed to update personal info:", error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">ข้อมูลโดยย่อเกี่ยวกับคุณ</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-grow">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700">ชื่อจริง</label>
                    <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700">นามสกุล</label>
                    <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="nickname" className="block text-sm font-bold text-gray-700">ชื่อเล่น</label>
                    <input type="text" name="nickname" id="nickname" value={formData.nickname} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>
                 <div>
                    <label htmlFor="gender" className="block text-sm font-bold text-gray-700">เพศ</label>
                    <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white">
                        <option value="">โปรดเลือก</option>
                        <option value="Male">ชาย</option>
                        <option value="Female">หญิง</option>
                        <option value="Other">อื่นๆ</option>
                    </select>
                </div>
                 <div className="col-span-2">
                    <label htmlFor="dateOfBirth" className="block text-sm font-bold text-gray-700">เกิดวันที่</label>
                    <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>
                <div className="col-span-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
                    <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                </div>
                <div className="col-span-2">
                    <label htmlFor="bio" className="block text-sm font-bold text-gray-700">สิ่งที่คุณถนัด / ข้อมูลส่วนตัวโดยย่อ</label>
                    <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
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

export default PersonalInfoForm;