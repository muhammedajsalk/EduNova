import React from "react";

const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) return <p className="text-red-500">No video available.</p>;

  return (
    <div className="w-full aspect-video bg-black rounded overflow-hidden">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover rounded"
        controlsList="nodownload"
      />
    </div>
  );
};

export default React.memo(VideoPlayer);
