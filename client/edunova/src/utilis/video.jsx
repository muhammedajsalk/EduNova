import React, { useRef, useEffect } from 'react';

 const MyVideoPreview = ({ myStream, isVideoOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && myStream && !isVideoOff) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream, isVideoOff]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      style={{ width: '100%', height: '100%', background: '#444', borderRadius: '12px' }}
    />
  );
};

export default React.memo(MyVideoPreview)
