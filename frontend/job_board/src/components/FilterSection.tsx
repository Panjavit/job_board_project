import { FaUser, FaGraduationCap, FaBriefcase, FaSearch } from "react-icons/fa";

 function FilterSection() {
  return (
    <div className=" bg-cover bg-center bg-no-repeat container max-w-[9800px] relative h-auto bg-gradient-to-br from-[#2e2b45] to-[#3b265f]  flex flex-col md:items-center md:justify-center-safe md:h-[360px]" style={{
     backgroundImage: "url('/image/bg-search.png')"
     }}>
      <div className=" scale-130 pr-15 mr-10">
       <h1 className=" text-3xl font-bold text-teal-400 mb-6 w-full text-left max-w-4xl">ค้นหางาน</h1>
       <div className="flex flex-wrap gap-4 items-center bg-transparent w-full max-w-4xl">
        <div className="flex items-center bg-white rounded shadow px-4 py-2 flex-grow min-w-[320px]">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="ตำแหน่งงาน"
            className="outline-none w-full"
          />
        </div>
        {/* dropdown วุฒิ */}
        <div className="flex items-center bg-white rounded shadow px-4 py-2 min-w-[200px]">
          <FaGraduationCap className="text-gray-400 mr-2" />
          <select className="outline-none bg-white w-full">
            <option>วุฒิการศึกษา</option>
            <option>ม.6</option>
            <option>ปวช.</option>
            <option>ปริญญาตรี</option>
          </select>
        </div>

        {/* dropdown ประเภท */}
        <div className="flex items-center bg-white rounded shadow px-4 py-2 min-w-[200px] pr-5">
          <FaBriefcase className="text-gray-400 mr-2" />
          <select className="outline-none bg-white w-full">
            <option>ประเภทงาน</option>
            <option>ประจำ</option>
            <option>พาร์ทไทม์</option>
          </select>
        </div>

        {/* ปุ่มค้นหา */}
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded shadow flex items-center pr-5">
          ค้นหา <FaSearch className="ml-2" />
        </button>
       </div>
      </div>
    </div>
  );
}
export default FilterSection;
