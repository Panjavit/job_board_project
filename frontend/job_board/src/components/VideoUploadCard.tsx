// components/VideoUploadCard.tsx
import React from 'react';

interface VideoUploadCardProps {
    videoUrl: string | null;
    onEditClick?: () => void;
}

const VideoUploadCard: React.FC<VideoUploadCardProps> = ({
    videoUrl,
    onEditClick,
}) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-gray-800">
                วิดีโอแนะนำตัว
            </h3>
            <div className="relative mb-4 flex min-h-[160px] items-center justify-center rounded-lg bg-gray-100 p-4">
                {videoUrl ? (
                    <iframe
                        className="aspect-video h-full w-full rounded-lg"
                        src={videoUrl}
                        title="วิดีโอแนะนำตัว"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                ) : (
                    // Placeholder สำหรับตอนที่ยังไม่มีวิดีโอ
                    <div className="text-center text-gray-500">
                        <i className="fa-solid fa-video-slash text-4xl"></i>
                        <p className="mt-2 text-sm">ยังไม่มีวิดีโอแนะนำตัว</p>
                    </div>
                )}
            </div>

            {onEditClick && (
                <button
                    type="button"
                    onClick={onEditClick}
                    className="inline-block w-full cursor-pointer rounded border border-teal-500 px-4 py-2 text-center text-sm text-teal-500 hover:bg-teal-50"
                >
                    {videoUrl ? 'แก้ไขข้อมูลวิดีโอ' : 'เพิ่มวิดีโอ'}
                </button>
            )}
        </div>
    );
};

export default VideoUploadCard;
