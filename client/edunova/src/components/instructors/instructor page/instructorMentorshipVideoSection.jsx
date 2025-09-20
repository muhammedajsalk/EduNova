import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
  Video, Mic, MicOff, VideoOff, Phone, PhoneOff, Settings, Maximize2,
  MessageSquare, Users, ScreenShare, ScreenShareOff, MoreVertical, Clock
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import UserContext from '../../../userContext';
import { usePeer } from '../../../utilis/peer';
import { MyVideoPreview } from '../../../utilis/video';

const InstructorMentorshipVideoCallSection = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [remoteUserId, setRemoteUserId] = useState()

  const { id: mentorshipId, userId } = useParams(); // userId is the mentee
  const { user, participants, setParticipants, videoUserName } = useContext(UserContext);

  const socketRef = useRef(null);
  const offerRef = useRef(null);
  const sentOfferRef = useRef(false);

  const {peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  // Call timer
  useEffect(() => {
    if (!isInCall) {
      setCallDuration(0);
      return;
    }
    const i = setInterval(() => setCallDuration(p => p + 1), 1000);
    return () => clearInterval(i);
  }, [isInCall]);

  // Capture local video/audio
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(setMyStream);
  }, []);

  const handleNegosiation = useCallback(() => {
    const socket = socketRef.current;  
    const localOffer = peer.localDescription;
    socket.emit('user-is-calling', { userId: remoteUserId, offer: localOffer })
  }, [peer.localDescription,remoteUserId,socketRef]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegosiation)
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegosiation);
    }
  }, [])

  // Setup socket only once
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", { withCredentials: true });
    const socket = socketRef.current;

    if (mentorshipId) socket.emit("join-lobby", mentorshipId);

    socket.on("incoming-call", ({ from, offer }) => {
      if (from === userId) {
        offerRef.current = offer;
        console.log("offered", offer)
      }
    });

    socket.on("call-accepted", async ({ ans }) => {
      if (sentOfferRef.current) {
        await setRemoteAns(ans);
        console.log("answered", ans)
        sendStream(myStream);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, mentorshipId, myStream, sendStream, setRemoteAns]);

  const joinVideoCall = async () => {
    const socket = socketRef.current;

    if (!offerRef.current) {
      // instructor initiates the offer
      const offer = await createOffer();
      sentOfferRef.current = true;
      socket.emit("user-is-calling", {
        mentorshipId,
        userName: user.name,
        role: "instructor",
        userId,
        offer,
        senderId: user._id
      });
      setRemoteUserId(userId)
      socket.emit("video-room", { mentorshipId, userId: user._id, role: "instructor" });
    } else {
      // if mentee already called, instructor answers
      const ans = await createAnswer(offerRef.current);
      socket.emit("call-accepted", { userId: user._id, ans });
      setRemoteUserId(userId)
    }

    setParticipants(p => p + 1);
    setIsInCall(true);
    if (myStream) sendStream(myStream);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex-shrink-0 flex justify-between items-center">
        <h1>you are connected {remoteUserId}</h1>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Mentorship Session (Instructor)</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${videoUserName === "" ? "bg-red-500" : "bg-green-500"}`}></div>
            <span className="text-sm text-slate-400">
              {videoUserName === "" ? "No Participant" : videoUserName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants} participants</span>
          </div>
          {isInCall && (
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
            </div>
          )}
          <button className="p-2 hover:bg-slate-700 rounded-lg">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 relative bg-black overflow-hidden">
        {!isInCall ? (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto ring-4 ring-slate-600 ring-offset-4 ring-offset-slate-900">
                  <Video className="w-16 h-16 text-slate-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Ready to start your mentorship?</h3>
              <p className="text-slate-400 mb-8">Click below when you’re ready to connect with your student.</p>
              <button
                onClick={joinVideoCall}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2"
              >
                <Phone className="w-5 h-5" /> Start Call
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-6xl max-h-[80vh] bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-slate-700 to-slate-800">
                  <MyVideoPreview myStream={remoteStream} />
                </div>
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                    <ScreenShare className="w-4 h-4" /> Screen Sharing
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Small Preview */}
            <div className="absolute bottom-24 right-6 w-72 h-48 bg-slate-800 rounded-lg shadow-2xl overflow-hidden border-2 border-slate-600">
              <MyVideoPreview myStream={myStream} isVideoOff={isVideoOff} />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-slate-400 font-mono">{formatDuration(callDuration)}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-slate-700'}`}>
                    {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                  </button>
                  <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-slate-700'}`}>
                    {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                  </button>
                  <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-4 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-slate-700'}`}>
                    {isScreenSharing ? <ScreenShareOff className="w-5 h-5 text-white" /> : <ScreenShare className="w-5 h-5 text-white" />}
                  </button>
                  <button onClick={() => setIsInCall(false)} className="p-4 bg-red-500 rounded-full">
                    <PhoneOff className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={() => setShowChat(!showChat)} className="p-3 bg-slate-700 rounded-full">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-3 bg-slate-700 rounded-full">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(InstructorMentorshipVideoCallSection);