const EducationSide = () => {
    return (
        
        <form className="h-full w-full">
            <h1 className="text-2xl font-bold">เพิ่มข้อมูลการศึกษา</h1>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="qualification" className="text-lg font-bold">
                    หลักสูตรหรือวุฒิการศีกษา
                </label>
                <input
                    type="text"
                    id="qualification"
                    placeholder="..."
                    className="outline-normal-active rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                />
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="institution" className="text-lg font-bold">
                    สถาบันการศึกษา
                </label>
                <input
                    type="text"
                    id="institution"
                    placeholder="..."
                    className="outline-normal-active rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                />
            </div>
            <div className="mt-4 flex w-full flex-col gap-2">
                <label htmlFor="start-date" className="text-lg font-bold">
                    ระดับปีการศีกษา
                </label>
                <div className="flex w-full justify-between gap-8">
                    <input
                        type="number"
                        placeholder="0"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 text-center outline-offset-4"
                    />
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="description" className="text-lg font-bold">
                    หลักสูตรอื่นๆ <span className="text-stone-500">(ไม่จำเป็นต้องระบุ)</span>
                </label>
                <textarea
                    id="description"
                    placeholder="บริษัท..."
                    className="outline-normal-active max-h-[300px] min-h-[300px] rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                />
            </div>
        </form>
        
    );
};

export default EducationSide;
