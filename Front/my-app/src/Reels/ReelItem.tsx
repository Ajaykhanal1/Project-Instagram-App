import { useRef, useEffect, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

export default function ReelItem({ url, username, title }: {
  url: string;
  username: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  // 🔥 AUTO PLAY ON LOAD + SCROLL (INSTAGRAM STYLE)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // 🔥 START MUTED
          video.muted = true;
          setMuted(true);

          video.play().then(() => {

            // 🔥 AFTER 1 SECOND → UNMUTE
            setTimeout(() => {
              video.muted = false;
              setMuted(false);
            }, 100);
          }).catch(() => { });
        } else {
          video.pause();
        }
      },
      { threshold: 0.75 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);


  // 👆 TAP → PLAY / PAUSE
  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setShowPlayIcon(false);
    } else {
      video.pause();
      setShowPlayIcon(true);

      setTimeout(() => setShowPlayIcon(false), 800);
    }
  };

  // 🔊 MUTE / UNMUTE
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    const newMuted = !muted;

    setMuted(newMuted);
    video.muted = newMuted;

    if (!newMuted) {
      // 🔥 FORCE AUDIO RE-ATTACH (IMPORTANT FIX)
      const currentTime = video.currentTime;

      video.pause();
      video.currentTime = currentTime;

      video.play().catch(() => {
        setTimeout(() => {
          video.play().catch(() => { });
        }, 50);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-black"
    >
      {/* 🎬 VIDEO */}
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        autoPlay
        onClick={handleTogglePlay}
      />

      {/* ▶ PLAY ICON */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 p-4 rounded-full">
            <Play size={60} color="white" />
          </div>
        </div>
      )}

      {/* 🔊 RIGHT CONTROLS */}
      <div className="absolute right-3 bottom-4 text-white flex flex-col gap-4">
        <button
          onClick={toggleMute}
          className="p-2 bg-black/30 rounded-full"
        >
          {muted ? (
            <VolumeX size={22} />
          ) : (
            <Volume2 size={22} />
          )}
        </button>
      </div>

      {/* 📝 BOTTOM TEXT */}
      <div className="absolute bottom-6 left-4 right-16 text-white">
        <p className="font-semibold text-sm">@{username}</p>
        <p className="text-sm text-gray-300 mt-1">{title}</p>
      </div>
    </div>
  );
}