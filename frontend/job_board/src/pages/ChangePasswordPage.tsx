import React, {useState} from "react";
import api from '../services/api';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const ChangePasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if(newPassword !== confirmPassword){
            setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }

        try {
            const response = await api.post('/auth/change-password',{
                oldPassword,
                newPassword,
            });
            setSuccess(response.data.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                if (user?.role === 'COMPANY') {
                    navigate('/company-profile');
                } else {
                    navigate('/profile');
                }
            }, 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
    };
    return (
        <div className="flex justify-center items-start pt-20 bg-gray-50 min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">เปลี่ยนรหัสผ่าน</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">รหัสผ่านเดิม</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">รหัสผ่านใหม่</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    {success && <p className="text-sm text-center text-green-500">{success}</p>}

                    <button type="submit" className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md">
                        ยืนยันการเปลี่ยนรหัสผ่าน
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;