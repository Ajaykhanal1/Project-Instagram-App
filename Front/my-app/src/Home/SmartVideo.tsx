import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

export default function SmartVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  // 🔥 INSTAGRAM REELS STYLE AUTO PLAY
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // 🔥 START MUTED
          video.muted = true;
          setMuted(true);

          video.play().then(() => {
            // 🔥 AUTO UNMUTE AFTER START
            setTimeout(() => {
              video.muted = false;
              setMuted(false);
            }, 100);
          }).catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // 👆 TAP PLAY / PAUSE
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

  // 🔊 MUTE / UNMUTE (REELS STYLE FIXED)
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    const newMuted = !muted;

    setMuted(newMuted);
    video.muted = newMuted;

    if (!newMuted) {
      const currentTime = video.currentTime;

      video.pause();
      video.currentTime = currentTime;

      video.play().catch(() => {
        setTimeout(() => {
          video.play().catch(() => {});
        }, 50);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-90 h-100 relative overflow-hidden rounded-lg bg-black"
    >
      {/* 🎬 VIDEO */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={muted}
        autoPlay
        onClick={handleTogglePlay}
      />

      {/* ▶ PLAY ICON */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 p-3 rounded-full">
            <Play size={60} color="white" />
          </div>
        </div>
      )}

      {/* 🔊 BUTTON */}
      <button
        onClick={toggleMute}
        className="absolute right-3 bottom-3 bg-black/40 p-2 rounded-full text-white"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
}