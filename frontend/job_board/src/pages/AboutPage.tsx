
import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* เกี่ยวกับเรา - Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-400 text-white py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Mobile Phones */}
          <div className="flex justify-center items-center space-x-8">
            {/* Left Phone (Pi App) */}
            <div className="transform rotate-12">
              <div className="w-40 h-80 bg-gray-300 rounded-3xl shadow-2xl">
                {/* Phone placeholder for Pi app */}
              </div>
            </div>
            
            {/* Right Phone (Trading Screen) */}
            <div className="transform -rotate-6">
              <div className="w-40 h-80 bg-gray-800 rounded-3xl shadow-2xl">
                {/* Phone placeholder for trading screen */}
              </div>
            </div>
          </div>
          
          {/* Right Side - Content */}
          <div>
            <h1 className="text-5xl font-bold mb-6">เกี่ยวกับเรา</h1>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                พวกเราคือบริษัทที่มุ่งมั่นสร้างแพลตฟอร์มในการค้นหางานที่ดีที่สุดสำหรับการลงทุนและการจ้างงาน
                ด้วยเทคโนโลยีที่ล้ำสมัยและทีมงานมืออาชีพ เพื่อให้ความสะดวกทั้งแก่นักลงทุนและผู้หางาน
                ในการเชื่อมต่อและสร้างโอกาสใหม่ๆ ในโลกการลงทุนและการทำงานได้อย่างไร้ขีดจำกัด
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ข้อมูลบริษัท Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Team Photo Card */}
            <div className="relative">
              <div className="bg-blue-600 rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">Pi</span>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">Investing. Simplified.</h3>
                  </div>
                </div>
                
                {/* Team Photo Placeholder */}
                <div className="w-full h-64 bg-blue-500 rounded-xl">
                  {/* รูปทีมงาน 3 คน */}
                </div>
              </div>
            </div>
            
            {/* Right Side - Company Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">ข้อมูลบริษัท</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  บริษัทหลักทรัพย์ พาย จำกัด หรือ Pi Securities 
                  เป็นผู้ให้บริการด้านการลงทุนที่มีประสบการณ์ในการยาวนานกว่า 50 ปี เป็นนายหน้าซื้อขายหลักทรัพย์ 3 
                  ช่องทางครอบคลุมทั้งหุ้นในประเทศ (SET)
                </p>
                <p>
                  และยังมีการให้บริการให้กับองค์กรต่างชาติการออกหลักทรัพย์ที่มีมาตรฐานสากลทั้งสกีมทำธุรกิจ (ก.ล.ต.)
                </p>
                <p>
                  โดยเรามีข้อมูลคุณแพลนด้วยสินลักษณ์ของ Pi Financial 
                  ที่ข่าวของเราและการให้บริการทองในการเป็นเครื่องทำผลประกันการนำเอาปัจจัยในการเฉลิมฉลองการลงทุนได้นะการเลือกรายที่ก็ในการถูกได้ในขณะ
                  ก้าเสะและพร ดั้งผิดผิดสร้างความน่า ฯ
                </p>
                <p>
                  หมุนพอร์ตการของโครงการและสร้างความส่งลักษณ์การเงินทุนที่ดึงดูกมียังไม่ได้ไรดำมการใหม่
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* วิสัยทัศน์ Section */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        {/* Floating Gold Coins */}
        <div className="absolute top-20 right-32 w-16 h-16 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-yellow-300 rounded-full"></div>
        <div className="absolute top-32 right-60 w-10 h-10 bg-yellow-500 rounded-full"></div>
        <div className="absolute bottom-40 right-40 w-20 h-20 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-20 right-24 w-14 h-14 bg-yellow-300 rounded-full"></div>
        <div className="absolute bottom-32 right-72 w-8 h-8 bg-yellow-500 rounded-full"></div>
        <div className="absolute top-60 right-16 w-18 h-18 bg-yellow-400 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <h2 className="text-4xl font-bold mb-8">วิสัยทัศน์</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  สร้างสรรค์นวัตกรรมใหม่สำหรับการลงทุนที่ทุกคนเข้าถึงได้อย่างง่าย
                </p>
                <p>
                  และช่วยให้นักลงทุนทุกประเภทสามารถลงทุนอย่างมีการป้องกันดูแลเพื่อสร้าง
                  ประสิทธิภาพ สำหรับใครก็ตามที่ร่วมกลุ่มลงทุนได้อย่างปลอดภัย
                </p>
              </div>
            </div>
            
            {/* Right Side - Executive Team Photo */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl p-6">
                {/* Executive Team Photo Placeholder */}
                <div className="w-80 h-64 bg-teal-500 rounded-xl">
                  {/* รูปทีมผู้บริหาร 5 คน */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* พันธกิจ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Meeting Photo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-2xl p-6 relative">
                {/* IDEA TRADE Watermark */}
                <div className="absolute top-6 left-6 z-10">
                  <h3 className="text-4xl font-bold text-purple-400 opacity-60">IDEA</h3>
                  <h4 className="text-2xl font-bold text-purple-400 opacity-60">TRADE</h4>
                </div>
                
                {/* Meeting Photo Placeholder */}
                <div className="w-full h-64 bg-purple-300 rounded-xl">
                  {/* รูปการประชุม 3 คน */}
                </div>
              </div>
            </div>
            
            {/* Right Side - Mission Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">พันธกิจ</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  เปิดให้การให้ความช่วยเหลือในการค้นหาการลงทุนที่เหมาะสมกับลูกค้าของการไดการ
                </p>
                <p>
                  ประสานใบการยองหลายทุนภาคโปรดได้ผมลิงดีพี่อิด้าง
                </p>
                <p>
                  พร้อมนำยอมมากระหว่างความการณ์เดินทำดีเงินมานักลงทุนมีโฮมมูเสร์
                  ร่วยสนลันอนาคร
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;