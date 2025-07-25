import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface PortfolioSideProps {
    currentPortfolioUrl: string | null;
    onUpdate: () => void;
    onClose: () => void;
}

const PortfolioSide: React.FC<PortfolioSideProps> = ({ currentPortfolioUrl, onUpdate, onClose }) => {
    const [portfolioUrl, setPortfolioUrl] = useState('');

    useEffect(() => {
        setPortfolioUrl(currentPortfolioUrl || '');
    }, [currentPortfolioUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch('/profiles/candidate/me/personal-info', {
                portfolioUrl: portfolioUrl,
            });
            toast.success('อัปเดตลิงก์ผลงานสำเร็จ!');
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update portfolio link:", error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
            <h2 className="mb-6 text-2xl font-bold">แก้ไขลิงก์ผลงาน</h2>
            <div className="flex-grow">
                <label htmlFor="portfolioUrl" className="block text-sm font-bold text-gray-700">
                    ลิงก์ผลงาน (Portfolio/GitHub)
                </label>
                <input
                    type="url"
                    name="portfolioUrl"
                    id="portfolioUrl"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 font-semibold">
                    ยกเลิก
                </button>
                <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white">
                    บันทึก
                </button>
            </div>
        </form>
    );
};

export default PortfolioSide;