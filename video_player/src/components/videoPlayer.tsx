import React, { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
} from "react-icons/fa";

type AppProps = {
  src: any;
  thumbNail: any;
};

const VideoPlayer = ({ src, thumbNail }: AppProps) => {
  const videoRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [useNativeControl, setUseNativeControls] = useState(
    window.innerWidth < 676
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setUseNativeControls(window?.innerWidth < 676);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleVideoEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      stopProgressLoop();
    };

    if (video) {
      //this is for as the video will end bring it to intial state
      video.addEventListener("ended", handleVideoEnd);
    }
    //  clean up
    return () => {
      if (video) {
        video.removeEventListener("ended", handleVideoEnd);
      }
      stopProgressLoop();
    };
  }, []);

  const updateProgess = () => {
    if (videoRef.current) {
      const value =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(value);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        startProgressLoop();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        stopProgressLoop();
      }
    }
  };

  const startProgressLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      updateProgess();
    }, 1000);
  };

  const stopProgressLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: any) => {
    const seekTo = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTo;
    setProgress(e.target.value);
  };

  const toggleFullScreen = () => {
    const element = videoRef.current;
    if (element) {
      if (!isFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const toggleMute = () => {
    const currentVolume = videoRef.current.volume;
    if (currentVolume > 0) {
      videoRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    } else {
      videoRef.current.volume = 1;
      setVolume(1);
      setIsMuted(false);
    }
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const extendVideo = (seconds: number) => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.currentTime += seconds;
    }
  };

  const renderCustomControls = () => {
    return (
      <div>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button onClick={stopVideo}>
          <FaStop />
        </button>

        <button onClick={() => extendVideo(-5)}>Rewind -5s</button>

        <button onClick={() => extendVideo(5)}>Forward +5s</button>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
        />

        <button onClick={toggleMute}>
          {!isMuted ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolumeChange}
        />

        <button onClick={toggleFullScreen}>
          {isFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    );
  };
  return (
    <div>
      <video
        className="video-player"
        src={src}
        ref={videoRef}
        poster={thumbNail}
        onClick={togglePlayPause}
        onPlay={startProgressLoop}
        onPause={stopProgressLoop}
        controls={useNativeControl}
      />
      {!useNativeControl && renderCustomControls()}
    </div>
  );
};

export default VideoPlayer;
