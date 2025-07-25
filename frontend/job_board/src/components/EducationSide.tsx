import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface EducationSideProps {
    currentProfile: any;
    onUpdate: (updatedProfile: any) => void;
    onClose: () => void;
}

const EducationSide: React.FC<EducationSideProps> = ({
    currentProfile,
    onUpdate,
    onClose,
}) => {
    //Stateสำหรับเก็บข้อมูลในฟอร์ม
    const [formData, setFormData] = useState({
        major: '',
        studyYear: '',
        education: '', //ข้อมูลสรุป (สถาบัน + หลักสูตรอื่นๆ)
    });

    //เมื่อคอมโพเนนต์โหลด, นำข้อมูลจากโปรไฟล์ปัจจุบันมาใส่ในฟอร์ม
    useEffect(() => {
        if (currentProfile) {
            setFormData({
                major: currentProfile.major || '',
                studyYear: currentProfile.studyYear?.toString() || '',
                education: currentProfile.education || '',
            });
        }
    }, [currentProfile]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //ส่งข้อมูลไปอัปเดต
            await api.patch('/profiles/candidate/me/personal-info', {
                ...formData,
                studyYear: formData.studyYear
                    ? parseInt(formData.studyYear, 10)
                    : null,
            });

            toast.success('อัปเดตข้อมูลการศึกษาสำเร็จ!');

            //ดึงข้อมูลโปรไฟล์ทั้งหมดมาใหม่
            const response = await api.get('/profiles/candidate/me');

            //อัปเดต State ด้วยข้อมูลที่สมบูรณ์จาก response ใหม่นี้
            onUpdate(response.data);

            onClose();
        } catch (error) {
            console.error('Failed to update education info:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
            <h1 className="text-2xl font-bold">ข้อมูลการศึกษาของคุณ</h1>
            <div className="mt-6 flex flex-grow flex-col gap-4">
                <div>
                    <label htmlFor="major" className="text-lg font-bold">
                        หลักสูตรหรือวุฒิการศึกษา
                    </label>
                    <input
                        type="text"
                        id="major"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        placeholder="เช่น วิทยาการคอมพิวเตอร์"
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
                <div>
                    <label htmlFor="studyYear" className="text-lg font-bold">
                        ระดับการศึกษา/ชั้นปี
                    </label>
                    <input
                        type="number"
                        id="studyYear"
                        name="studyYear"
                        value={formData.studyYear}
                        onChange={handleChange}
                        placeholder="เช่น 4"
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
                <div>
                    <label htmlFor="education" className="text-lg font-bold">
                        รายละเอียดเพิ่มเติม
                        <span className="font-normal text-stone-500">
                            {' '}
                            (เช่น ชื่อสถาบัน, เกียรตินิยม, หลักสูตรอื่นๆ)
                        </span>
                    </label>
                    <textarea
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        rows={6}
                        placeholder="เช่น มหาวิทยาลัย... , เกียรตินิยมอันดับ..."
                        className="mt-2 w-full rounded-lg border-2 border-stone-400 px-4 py-3"
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
                >
                    ยกเลิก
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
                >
                    บันทึก
                </button>
            </div>
        </form>
    );
};

export default EducationSide;
