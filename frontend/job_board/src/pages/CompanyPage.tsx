import React, { useState } from 'react';
import { Edit3, Phone, Mail, Globe, User } from 'lucide-react';

interface ContactInfo {
  name: string;
  nameEn: string;
  position: string;
  department: string;
  phones: string[];
  email: string;
}

interface CompanyInfo {
  name: string;
  nameEn: string;
  address: string[];
  website: string;
  logo?: string;
}

interface JobApplicant {
  id: number;
  position: string;
  skill: string;
  university: string;
  status?: 'interested' | 'reviewing' | 'shortlisted';
}

interface CompanyData {
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  applicants: JobApplicant[];
}

const CompanyPage: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    contactInfo: {
      name: "ญาณิสา แผ่รุ่งเรือง",
      nameEn: "Yanisa Phaerunggrueang",
      position: "ผู้ช่วยกรรมการผู้จัดการ",
      department: "ฝ่ายกำหนดทรัพย์ A3/1",
      phones: ["02 205 7041", "064 494 7456"],
      email: "yanisa.ph@pi.financial"
    },
    companyInfo: {
      name: "บริษัทหลักทรัพย์ พาย จำกัด (มหาชน)",
      nameEn: "Pi Securities Public Company Limited",
      address: [
        "132 อาคารสินธร ทาวเวอร์ 3 ชั้น 18",
        "ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน",
        "กรุงเทพมหานคร 10330"
      ],
      website: "www.pi.financial",
      logo: "pi"
    },
    applicants: [
      {
        id: 1,
        position: "ปฏิบัติงาน นักคุมบัน",
        skill: "UX/UI",
        university: "มหาวิทยาลัยมหิดล"
      },
      {
        id: 2,
        position: "ปฏิบัติงาน นักคุมบัน",
        skill: "Frontend",
        university: "มหาวิทยาลัยเทคโนโลยีเกษตรศาสตร์"
      },
      {
        id: 3,
        position: "ปฏิบัติงาน นักคุมบัน",
        skill: "Dev",
        university: "มหาวิทยาลัยนเรทร"
      },
      {
        id: 4,
        position: "ปฏิบัติงาน นักคุมบัน",
        skill: "UX/UI",
        university: "มหาวิทยาลัยศิลปกร"
      }
    ]
  });

  const handleEditCompany = (): void => {
    console.log('Edit company clicked');
  };

  const handleAccountStatus = (): void => {
    console.log('Account status clicked');
  };

  const handleUpdateApplicant = (id: number, updates: Partial<JobApplicant>): void => {
    setCompanyData(prev => ({
      ...prev,
      applicants: prev.applicants.map(applicant =>
        applicant.id === id ? { ...applicant, ...updates } : applicant
      )
    }));
  };

  const handleViewProfile = (applicantId: number): void => {
    console.log('View profile for applicant:', applicantId);
  };

  const handleContactApplicant = (applicantId: number): void => {
    console.log('Contact applicant:', applicantId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="h-[200px] bg-gradient-to-r from-teal-500 to-teal-800 text-white p-6 rounded-3xl ">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 ml-55" >
            <div className="bg-teal-400 rounded-lg w-24 h-24 flex items-center justify-center text-white text-xl font-bold mr-8">
              {companyData.companyInfo.logo || 'pi'}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-1 leading-tight">
                {companyData.companyInfo.name}
              </h1>
              <div className="text-teal-100 text-xl space-y-0.5">
                <p>{companyData.contactInfo.name}</p>
                <p>{companyData.contactInfo.position}</p>
                <p>{companyData.contactInfo.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mr-54 mt-15">
            <button 
              onClick={handleEditCompany}
              className="bg-white text-teal-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center mb-1 gap-2"
            >
              <Edit3 className="w-4 h-4" />
              แก้ไขข้อมูลบริษัท
            </button>
            <button 
              onClick={handleAccountStatus}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors  whitespace-nowrap"
            >
              คุณกำลังลงประกาศในบัญชีบริษัทอยู่
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">ข้อมูลของเรา</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-teal-600 font-medium text-base mb-1">
                  {companyData.contactInfo.name}
                </h3>
                <h4 className="text-teal-600 font-medium text-base mb-2">
                  {companyData.contactInfo.nameEn}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {companyData.contactInfo.position}<br />
                  {companyData.contactInfo.department}
                </p>
              </div>
              <div className="space-y-2">
                {companyData.contactInfo.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm">{phone}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-sm">{companyData.contactInfo.email}</span>
                </div>
              </div>
              <div>
                <h4 className="text-teal-600 font-medium text-base mb-2">
                  {companyData.companyInfo.nameEn}
                </h4>
                <div className="text-gray-700 text-sm space-y-1 leading-relaxed">
                  {companyData.companyInfo.address.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <a 
                  href={`https://${companyData.companyInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  {companyData.companyInfo.website}
                </a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">รายชื่อบุคคลที่สนใจ</h2>
              <span className="ml-auto text-sm text-gray-500">({companyData.applicants.length} คน)</span>
            </div>
            
            <div className="space-y-4">
              {companyData.applicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="p-4 border border-gray-100 rounded-lg hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-start">
                        <span className="text-gray-700 text-sm mr-2">{applicant.id}.</span>
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm font-medium">{applicant.position}</p>
                          <p className="text-teal-600 text-sm font-medium ml-4">{applicant.skill}</p>
                          <p className="text-gray-600 text-sm ml-4">{applicant.university}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewProfile(applicant.id)}
                        className="text-teal-600 hover:text-teal-700 text-xs px-2 py-1 border border-teal-200 rounded hover:bg-teal-50 transition-colors"
                      >
                        ดูโปรไฟล์
                      </button>
                      <button 
                        onClick={() => handleContactApplicant(applicant.id)}
                        className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                      >
                        ติดต่อ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;