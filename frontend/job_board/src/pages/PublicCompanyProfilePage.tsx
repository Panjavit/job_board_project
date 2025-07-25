import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Edit3, User, Mail, Phone, MapPin } from 'lucide-react';
import Linkify from '../components/Linkify';
import VideoUploadCard from '../components/VideoUploadCard';

// Interface สำหรับข้อมูลโปรไฟล์บริษัท
interface PublicCompanyProfile {
    companyName: string;
    about: string | null;
    location: string | null;
    logoUrl: string | null;
    recruiterName: string | null;
    recruiterPosition: string | null;
    contactInstructions: string;
    additionalContactInfo: string | null;
    emails: { email: string }[];
    phones: { phone: string }[];
    province: string | null;
    registrationNumber: string | null;
    legalName: string | null;
    companyType: string | null;
    businessTypeName: string | null;
    registeredCapital: number | null;
    videoUrl: string | null;
    workArrangement: string | null;
    workingDays: string | null;
    workingHours: string | null;
    workPolicy: string | null;
}

const PublicCompanyProfilePage: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const [profile, setProfile] = useState<PublicCompanyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (companyId) {
            const fetchCompanyProfile = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(
                        `/profiles/company/${companyId}`
                    );
                    setProfile(response.data);
                } catch (error) {
                    console.error('Failed to fetch company profile:', error);
                    setProfile(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCompanyProfile();
        }
    }, [companyId]);

    const getWorkArrangementText = (arrangement: string | null) => {
        switch (arrangement) {
            case 'HYBRID':
                return 'ไฮบริด (Hybrid)';
            case 'REMOTE':
                return 'ทำงานทางไกล (Remote)';
            case 'ONSITE':
            default:
                return 'เข้าออฟฟิศ (On-site)';
        }
    };

    if (isLoading)
        return <div className="p-10 text-center">กำลังโหลดข้อมูลบริษัท...</div>;
    if (!profile)
        return (
            <div className="p-10 text-center text-red-500">
                ไม่พบข้อมูลบริษัท
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Header */}
            <div
                className="h-auto rounded-xl bg-cover bg-center p-6 text-white md:h-[200px]"
                style={{ backgroundImage: "url('/image/bg-comp.png')" }}
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-6">
                        {profile.logoUrl ? (
                            <img
                                src={`http://localhost:5001${profile.logoUrl}`}
                                alt={profile.companyName}
                                className="h-38 w-40 rounded-lg bg-white object-cover"
                            />
                        ) : (
                            <div className="flex h-38 w-40 items-center justify-center rounded-lg bg-teal-400 text-3xl font-bold text-white uppercase">
                                {profile.companyName.substring(0, 2)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl leading-tight font-bold">
                                {profile.companyName}
                            </h1>
                            {profile.recruiterName && (
                                <p className="text-lg text-white/90">
                                    {profile.recruiterName}
                                </p>
                            )}
                            {profile.recruiterPosition && (
                                <p className="text-base text-white/80">
                                    {profile.recruiterPosition}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* หน้านี้เป็น Public จึงไม่มีปุ่มแก้ไข */}
                </div>
            </div>

            {/* Body Content */}
            <div className="mx-auto mt-6 max-w-7xl">
                {profile.videoUrl && (
                    <div className="mb-6">
                        <VideoUploadCard
                            videoUrl={profile.videoUrl}
                            role="COMPANY"
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* --- คอลัมน์ซ้าย --- */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* การ์ดเกี่ยวกับบริษัท */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                เกี่ยวกับบริษัท
                            </h2>
                            <p className="whitespace-pre-wrap text-gray-700">
                                {profile.about ||
                                    'ยังไม่มีข้อมูลเกี่ยวกับบริษัท'}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                รายละเอียดการทำงาน
                            </h2>
                            <div className="space-y-3 text-sm text-gray-700">
                                <p>
                                    <span className="font-semibold">
                                        รูปแบบ:
                                    </span>{' '}
                                    {getWorkArrangementText(
                                        profile.workArrangement
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        วันทำงาน:
                                    </span>{' '}
                                    {profile.workingDays || '-'}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        เวลาทำงาน:
                                    </span>{' '}
                                    {profile.workingHours || '-'}
                                </p>
                                {profile.workPolicy && (
                                    <div className="pt-2">
                                        <h3 className="font-semibold">
                                            รายละเอียดเพิ่มเติม:
                                        </h3>
                                        <p className="whitespace-pre-wrap">
                                            {profile.workPolicy}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* การ์ดข้อมูลทางทะเบียน */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                ข้อมูลทางธุรกิจ
                            </h2>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700 sm:grid-cols-2">
                                <p>
                                    <span className="font-semibold">
                                        ประเภทธุรกิจ:
                                    </span>{' '}
                                    {profile.businessTypeName || '-'}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        ประเภทนิติบุคคล:
                                    </span>{' '}
                                    {profile.companyType || '-'}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        จังหวัด:
                                    </span>{' '}
                                    {profile.province || '-'}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        ทุนจดทะเบียน:
                                    </span>{' '}
                                    {profile.registeredCapital?.toLocaleString(
                                        'th-TH'
                                    ) || '-'}{' '}
                                    บาท
                                </p>
                                <p className="sm:col-span-2">
                                    <span className="font-semibold">
                                        เลขทะเบียนนิติบุคคล:
                                    </span>{' '}
                                    {profile.registrationNumber || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- คอลัมน์ขวา (กว้าง 1 ส่วน) --- */}
                    <div className="space-y-6">
                        {/* การ์ดข้อมูลติดต่อ */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                ข้อมูลติดต่อ
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                {profile.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={18}
                                            className="mt-1 flex-shrink-0 text-gray-400"
                                        />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.emails.map(e => (
                                    <div
                                        key={e.email}
                                        className="flex items-start gap-3"
                                    >
                                        <Mail
                                            size={18}
                                            className="mt-1 flex-shrink-0 text-gray-400"
                                        />
                                        <a
                                            href={`mailto:${e.email}`}
                                            className="break-all hover:underline"
                                        >
                                            {e.email}
                                        </a>
                                    </div>
                                ))}
                                {profile.phones.map(p => (
                                    <div
                                        key={p.phone}
                                        className="flex items-start gap-3"
                                    >
                                        <Phone
                                            size={18}
                                            className="mt-1 flex-shrink-0 text-gray-400"
                                        />
                                        <span>{p.phone}</span>
                                    </div>
                                ))}
                                {profile.additionalContactInfo && (
                                    <div className="mt-3 border-t border-gray-100 pt-3">
                                        <h3 className="mb-2 font-semibold text-gray-800">
                                            ช่องทางติดต่อเพิ่มเติม
                                        </h3>
                                        <Linkify
                                            text={profile.additionalContactInfo}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicCompanyProfilePage;
