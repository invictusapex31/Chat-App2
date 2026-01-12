import React, { useEffect, useRef, useState } from 'react';

function VideoCall({ selectedUser, currentUser, socket, onEndCall }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    initializeCall();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveOffer = async ({ offer, senderId }) => {
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket.emit('webrtc:answer', {
          answer,
          callerId: senderId
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    };

    const handleReceiveAnswer = async ({ answer }) => {
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    const handleReceiveIceCandidate = async ({ candidate }) => {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    const handleCallEnded = () => {
      cleanup();
      onEndCall();
    };

    socket.on('webrtc:offer', handleReceiveOffer);
    socket.on('webrtc:answer', handleReceiveAnswer);
    socket.on('webrtc:ice-candidate', handleReceiveIceCandidate);
    socket.on('call:ended', handleCallEnded);

    return () => {
      socket.off('webrtc:offer', handleReceiveOffer);
      socket.off('webrtc:answer', handleReceiveAnswer);
      socket.off('webrtc:ice-candidate', handleReceiveIceCandidate);
      socket.off('call:ended', handleCallEnded);
    };
  }, [socket, onEndCall]);

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      };

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('webrtc:ice-candidate', {
            candidate: event.candidate,
            userId: selectedUser._id
          });
        }
      };

      // Create and send offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      if (socket) {
        socket.emit('webrtc:offer', {
          offer,
          receiverId: selectedUser._id
        });
      }
    } catch (error) {
      console.error('Error initializing call:', error);
    }
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    if (socket) {
      socket.emit('call:end', { userId: selectedUser._id });
    }
    cleanup();
    onEndCall();
  };

  return (
    <div className="video-call-modal">
      <div className="video-call-container">
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
        <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
        
        <div className="call-controls">
          <button onClick={toggleMute} className={isMuted ? 'muted' : ''}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={toggleVideo} className={isVideoOff ? 'video-off' : ''}>
            {isVideoOff ? '📹' : '📷'}
          </button>
          <button onClick={endCall} className="end-call">
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
