import React from 'react';

interface LinkifyProps {
  text: string | null | undefined;
}

const Linkify: React.FC<LinkifyProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <p className="whitespace-pre-wrap text-gray-700">
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </p>
  );
};

export default Linkify;