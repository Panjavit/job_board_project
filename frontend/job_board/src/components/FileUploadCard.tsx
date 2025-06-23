// components/FileUploadCard.tsx
import React from 'react';
import { Minus } from 'lucide-react';

interface FileUploadCardProps {
  title: string;
  files: FileData[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  accept?: string;
}
export interface FileData {
  name: string;
  url: string;
  type: string;
}



const FileUploadCard: React.FC<FileUploadCardProps> = ({ 
  title, 
  files = [], 
  onFileUpload, 
  onRemoveFile, 
  accept = "*" 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-base">{title}</h3>
      <div className="mb-4">
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                    <span className="text-xs text-teal-600">📄</span>
                  </div>
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                  type="button"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <label className="w-full inline-block text-teal-500 text-sm border border-teal-500 px-4 py-2 rounded hover:bg-teal-50 text-center cursor-pointer">
        แนบไฟล์
        <input 
          type="file" 
          multiple 
          accept={accept}
          onChange={onFileUpload} 
          className="hidden" 
        />
      </label>
    </div>
  );
};

export default FileUploadCard;