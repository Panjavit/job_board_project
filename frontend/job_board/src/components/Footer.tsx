const Footer = () => {
    return (
        <footer className="flex w-full bg-black text-white">
            <div className="bg-normal flex h-[400px] w-[20%] items-center justify-center">
                <img src="/ideatrade.svg" alt="ideatrade logo" className="" />
            </div>
            <div className="flex w-4/5 flex-col">
                <div className="flex h-[80%] items-center justify-center text-white border-b border-white">
                    <div className="flex w-[70%] flex-col items-center justify-center text-xl font-bold">
                        <h1>Pi Securities Public Company Limited</h1>
                        <h1>บริษัทหลักทรัพย์ พาย จำกัด (หมาชน)</h1>
                    </div>
                    <div className="flex h-full w-[30%] flex-col justify-evenly">
                        <p>ติดต่อเรา</p>
                        <p>
                            132 อาคารสินธร ทาวเวอร์ 3 ชั้น 27 ถนนวิทยุ
                            แขวนลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330
                        </p>
                        <p className="flex items-center gap-4">
                            <div className="bg-normal flex aspect-square h-8 items-center justify-center rounded-lg text-black">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            02 205 7041
                        </p>
                        <p className="flex items-center gap-4">
                            <div className="bg-normal flex aspect-square h-8 items-center justify-center rounded-lg text-black">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            yanisa.ph@pi.financial
                        </p>
                        <p>ญาณิศา แผ่รุ่งเรื่อง (ผู้ช่วยกรรมการผู้จัดการ)</p>
                    </div>
                </div>
                <p className="px-8 flex items-center h-1/5">2025 Pi Securities Public Company Limited. All right reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
