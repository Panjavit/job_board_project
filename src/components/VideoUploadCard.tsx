// components/VideoUploadCard.tsx
import React from 'react';

interface VideoUploadCardProps {
  videoUrl: string | null;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VideoUploadCard: React.FC<VideoUploadCardProps> = ({ videoUrl, onVideoUpload }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-base">วิดีโอแนะนำตัว</h3>
      <div className="bg-gray-100 rounded-lg p-4 mb-4 relative">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-32 object-cover rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div>
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-lg" 
              style={{backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=150&fit=crop)'}}
            ></div>
            <div className="relative z-10 flex items-center justify-center h-32">
              <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <label className="w-full inline-block text-teal-500 text-sm border border-teal-500 px-4 py-2 rounded hover:bg-teal-50 text-center cursor-pointer">
        {videoUrl ? 'เปลี่ยนวิดีโอ' : 'เพิ่มวิดีโอ'}
        <input 
          type="file" 
          accept="video/*" 
          onChange={onVideoUpload} 
          className="hidden" 
        />
      </label>
    </div>
  );
};

export default VideoUploadCard;