import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  /** CREATE OFFER */
  const createOffer = async () => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  };

  /** CREATE ANSWER */
  const createAnswer = async (offer) => {
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
    } catch (err) {
      console.error("Error creating answer:", err);
      throw err;
    }
  };

  /** SET REMOTE ANSWER */
  const setRemoteAns = async (ans) => {
    try {
      if (!peer.currentRemoteDescription) {
        await peer.setRemoteDescription(new RTCSessionDescription(ans));
        console.log("Remote answer set successfully");
      } else {
        console.log("Remote description already set, skipping...");
      }
    } catch (error) {
      console.error("Error setting remote answer:", error);
    }
  };

  /**
   * SEND STREAM (Optimized)
   * - Adds stream tracks only once
   * - Uses replaceTrack if track already added
   */
  const sendStream = (stream) => {
    if (!stream) return;

    const senders = peer.getSenders();

    stream.getTracks().forEach((track) => {
      const existingSender = senders.find(
        (sender) => sender.track && sender.track.kind === track.kind
      );
      if (existingSender) {
        // Replace track if already exists (avoids InvalidAccessError)
        existingSender.replaceTrack(track);
      } else {
        // Add new track if none exists yet
        peer.addTrack(track, stream);
      }
    });
  };

  /** HANDLE REMOTE TRACKS */
  const handleTrackEvent = useCallback((ev) => {
    const streams = ev.streams;
    if (streams[0]) {
      setRemoteStream(streams[0]);
    }
  }, []);

  

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    
    return () =>{
       peer.removeEventListener("track", handleTrackEvent);
    } 
  }, [peer, handleTrackEvent]);

  /** CONTEXT VALUE */
  const value = useMemo(
    () => ({
      peer,
      createOffer,
      createAnswer,
      setRemoteAns,
      sendStream,
      remoteStream,
    }),
    [peer, remoteStream]
  );

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
};