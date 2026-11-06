import { useEffect, useRef, useState } from "react";
import { useSong } from "../hooks/useSong";
import "./MusicPlayer.css";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function MusicPlayer() {
  const audioRef = useRef(null);
  const { song } = useSong();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackError, setPlaybackError] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    if (!song?.url) return;

    audio.load();
    audio.play().catch(() => {
      setPlaybackError("Click play to start music");
    });
  }, [song?.url]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !song?.url) return;

    setPlaybackError("");
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaybackError("Unable to play this track. Please try again.");
      }
    } else {
      audio.pause();
    }
  }

  function seek(event) {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function updateVolume(event) {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.muted = nextVolume === 0;
  }

  return (
    <section className="music-player" aria-label="Music player">
      <audio
        ref={audioRef}
        src={song?.url}
        onLoadStart={() => {
          setCurrentTime(0);
          setDuration(0);
          setPlaybackError("");
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setPlaybackError("This track could not be loaded.")}
      />

      <div className="music-player__artwork">
        {song?.posterImg ? (
          <img src={song.posterImg} alt="" />
        ) : (
          <div className="music-player__artwork-placeholder" aria-hidden="true">
            ♪
          </div>
        )}
      </div>

      <div className="music-player__details">
        <p className="music-player__eyebrow">NOW PLAYING</p>
        <h2 title={song?.title || "No track selected"}>
          {song?.title || "No track selected"}
        </h2>
        <p className="music-player__mood">
          {song?.mood ? `Picked for your ${song.mood} mood` : "Your personal soundtrack"}
        </p>
      </div>

      <div className="music-player__controls">
        <button
          className="music-player__play"
          type="button"
          onClick={togglePlayback}
          disabled={!song?.url}
          aria-label={isPlaying ? "Pause track" : "Play track"}
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <div className="music-player__timeline">
          <span>{formatTime(currentTime)}</span>
          <input
            aria-label="Track position"
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` }}
            disabled={!duration}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <label className="music-player__volume">
        <span aria-hidden="true">{volume === 0 ? "×" : "♪"}</span>
        <input
          aria-label="Volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={updateVolume}
          style={{ "--progress": `${volume * 100}%` }}
        />
      </label>

      {playbackError && (
        <p className="music-player__error" role="status">
          {playbackError}
        </p>
      )}
    </section>
  );
}

export default MusicPlayer;
