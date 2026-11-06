import { useSong } from "../hooks/useSong";
import "./Playlist.css";

function Playlist() {
  const { song, playlist, playlistError, loading, selectSong } = useSong();

  return (
    <aside className="playlist" aria-label="Playlist">
      <header className="playlist__header">
        <div>
          <p className="playlist__eyebrow">YOUR MUSIC</p>
          <h2>Playlist</h2>
        </div>
        <span className="playlist__count">{playlist.length}</span>
      </header>

      {loading ? (
        <p className="playlist__message" role="status">Finding songs for your mood…</p>
      ) : playlistError ? (
        <p className="playlist__message playlist__message--error" role="alert">
          {playlistError}
        </p>
      ) : playlist.length === 0 ? (
        <p className="playlist__message">
          Detect your expression to find a playlist that matches your mood.
        </p>
      ) : (
        <ul className="playlist__tracks">
          {playlist.map((track) => {
            const isActive = track.url === song?.url;

            return (
              <li key={track._id || track.url}>
                <button
                  className={`playlist__track${isActive ? " playlist__track--active" : ""}`}
                  type="button"
                  onClick={() => selectSong(track)}
                  aria-current={isActive ? "true" : undefined}
                  title={track.title}
                >
                  {track.posterImg ? (
                    <img className="playlist__artwork" src={track.posterImg} alt="" />
                  ) : (
                    <span className="playlist__artwork playlist__artwork--empty" aria-hidden="true">
                      ♪
                    </span>
                  )}
                  <span className="playlist__track-info">
                    <span className="playlist__track-title">{track.title}</span>
                    <span className="playlist__track-mood">{track.mood || "Mood mix"}</span>
                  </span>
                  <span className="playlist__track-icon" aria-hidden="true">
                    {isActive ? "♫" : "▶"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export default Playlist;
