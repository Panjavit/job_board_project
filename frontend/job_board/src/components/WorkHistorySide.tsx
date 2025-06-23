const WorkHistorySide = () => {
    return (
        <form className="h-full w-full">
            <h1 className="text-2xl font-bold">ประวัติการทำงานของคุณ</h1>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="position" className="text-lg font-bold">
                    ตำแหน่งงาน
                </label>
                <input
                    type="text"
                    id="position"
                    placeholder="ตำแหน่ง..."
                    className="outline-normal-active rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                />
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="company" className="text-lg font-bold">
                    บริษัท
                </label>
                <input
                    type="text"
                    id="company"
                    placeholder="บริษัท..."
                    className="outline-normal-active rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                />
            </div>
            <div className="mt-4 flex w-full flex-col gap-2">
                <label htmlFor="start-date" className="text-lg font-bold">
                    วันที่เริ่ม
                </label>
                <div className="flex w-full justify-between gap-8">
                    <input
                        type="text"
                        placeholder="DD"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                    <input
                        type="text"
                        placeholder="MM"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                    <input
                        type="text"
                        placeholder="YYYY"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                </div>
            </div>
            <div className="mt-4 flex w-full flex-col gap-2">
                <label htmlFor="end-date" className="text-lg font-bold">
                    วันที่สิ้นสุด
                </label>
                <div className="flex w-full justify-between gap-8">
                    <input
                        type="text"
                        placeholder="DD"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                    <input
                        type="text"
                        placeholder="MM"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                    <input
                        type="text"
                        placeholder="YYYY"
                        className="outline-normal-active w-1/3 rounded-lg border-2 border-stone-500 px-4 py-4 outline-offset-4"
                    />
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="description" className="text-lg font-bold">
                    รายระเอียดการทำงาน
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

export default WorkHistorySide;
