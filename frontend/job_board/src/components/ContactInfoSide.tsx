import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactInfoSideProps {
    currentProfile: {
        emails: { id: string; email: string }[];
        phones: { id: string; phone: string }[];
        additionalContactInfo: string | null;
    };
    onUpdate: () => void;
    onClose: () => void;
}

const ContactInfoSide: React.FC<ContactInfoSideProps> = ({ currentProfile, onUpdate, onClose }) => {
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [additionalContactInfo, setAdditionalContactInfo] = useState('');

    useEffect(() => {
        setAdditionalContactInfo(currentProfile.additionalContactInfo || '');
    }, [currentProfile]);


    const handleAddEmail = async () => {
        if (!newEmail) return;
        await api.post('/contacts/emails', { email: newEmail });
        setNewEmail('');
        onUpdate();
    };

    const handleDeleteEmail = async (id: string) => {
        if (window.confirm('ยืนยันการลบอีเมลนี้?')) {
            await api.delete(`/contacts/emails/${id}`);
            onUpdate();
        }
    };

    const handleAddPhone = async () => {
        if (!newPhone) return;
        await api.post('/contacts/phones', { phone: newPhone });
        setNewPhone('');
        onUpdate();
    };

    const handleDeletePhone = async (id: string) => {
        if (window.confirm('ยืนยันการลบเบอร์โทรนี้?')) {
            await api.delete(`/contacts/phones/${id}`);
            onUpdate();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/profiles/company/me', { additionalContactInfo });
            toast.success('บันทึกข้อมูลติดต่อเพิ่มเติมสำเร็จ!');
            onUpdate(); 
            onClose(); 
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <h1 className="text-2xl font-bold">แก้ไขข้อมูลติดต่อ</h1>
            <div className="mt-6 flex-grow space-y-6 overflow-y-auto pr-2">
                {/* Email Section (เหมือนเดิม) */}
                <div>
                    <h2 className="font-bold text-lg">อีเมล</h2>
                    <div className="mt-2 space-y-2">
                        {currentProfile.emails.map(e => (
                            <div key={e.id} className="flex items-center justify-between rounded-md bg-gray-100 p-2">
                                <span>{e.email}</span>
                                <button type="button" onClick={() => handleDeleteEmail(e.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="เพิ่มอีเมลใหม่" className="flex-grow rounded-md border px-2 py-1"/>
                        <button type="button" onClick={handleAddEmail} className="rounded-md bg-teal-500 px-3 text-white"><Plus size={16}/></button>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-lg">เบอร์โทรศัพท์</h2>
                    <div className="mt-2 space-y-2">
                        {currentProfile.phones.map(p => (
                            <div key={p.id} className="flex items-center justify-between rounded-md bg-gray-100 p-2">
                                <span>{p.phone}</span>
                                <button type="button" onClick={() => handleDeletePhone(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                        <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="เพิ่มเบอร์โทรใหม่" className="flex-grow rounded-md border px-2 py-1"/>
                        <button type="button" onClick={handleAddPhone} className="rounded-md bg-teal-500 px-3 text-white"><Plus size={16}/></button>
                    </div>
                </div>

                {/* เพิ่ม Section นี้เข้ามา */}
                <div>
                    <label htmlFor="additionalContactInfo" className="font-bold text-lg">ช่องทางติดต่อเพิ่มเติม (LINE, Facebook)</label>
                    <textarea
                        id="additionalContactInfo"
                        name="additionalContactInfo"
                        rows={3}
                        value={additionalContactInfo}
                        onChange={(e) => setAdditionalContactInfo(e.target.value)}
                        className="mt-1 w-full rounded-lg border-2 p-2"
                    />
                </div>
            </div>
            <div className="mt-auto flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold">ยกเลิก</button>
                <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white">บันทึก</button>
            </div>
        </form>
    )
}

export default ContactInfoSide;