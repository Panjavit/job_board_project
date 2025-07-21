import React from 'react';

interface VideoUploadCardProps {
    videoUrl: string | null;
    onEditClick?: () => void;
    role?: 'CANDIDATE' | 'COMPANY';
}

const getYouTubeEmbedUrl = (url: string | null): string | null => {
    if (!url) {
        return null;
    }

    let videoId = null;

    const urlParams = new URLSearchParams(new URL(url).search);
    if (urlParams.has('v')) {
        videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('/embed/')) {
        videoId = url.split('/embed/')[1].split('?')[0];
    }

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
};

const VideoUploadCard: React.FC<VideoUploadCardProps> = ({
    videoUrl,
    onEditClick,
    role = 'CANDIDATE',
}) => {
    const isCompany = role === 'COMPANY';
    const titleText = isCompany ? 'วิดีโอแนะนำบริษัท' : 'วิดีโอแนะนำตัว';
    const placeholderText = isCompany
        ? 'ยังไม่มีวิดีโอแนะนำบริษัท'
        : 'ยังไม่มีวิดีโอแนะนำตัว';

    //เรียกใช้ฟังก์ชันแปลง URL ก่อนส่งไปแสดงผล
    const embedUrl = getYouTubeEmbedUrl(videoUrl);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-gray-800">
                {titleText}
            </h3>
            <div className="relative mb-4 flex min-h-[160px] items-center justify-center rounded-lg bg-gray-100 p-4">
                {/* ใช้ embedUrl ที่แปลงแล้ว */}
                {embedUrl ? (
                    <iframe
                        className="float-left mr-4 aspect-video h-full max-w-lg rounded-lg"
                        src={embedUrl}
                        title={titleText}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="text-center text-gray-500">
                        <i className="fa-solid fa-video-slash text-4xl"></i>
                        <p className="mt-2 text-sm">{placeholderText}</p>
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
