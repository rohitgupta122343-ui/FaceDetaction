
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RiArrowLeftLine,
    RiMusic2Line,
    RiUploadCloud2Line
} from "@remixicon/react";

import "../style/addsongs.css";
import { useSong } from "../../home/hooks/useSong";

function AddSong() {
    const { loading, handleAddSong } = useSong();
    const navigate = useNavigate();

    const [song, setsong] = useState(null);
    const [mood, setMood] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    const moods = [
        { value: "happy", label: "Happy", emoji: "☀" },
        { value: "sad", label: "Sad", emoji: "☁" },
        { value: "surprised", label: "Surprised", emoji: "✦" },
    ];

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");
        setSubmitSuccess("");

        if (!song || !mood) {
            setSubmitError("Please select an MP3 file and a mood.");
            return;
        }

        try {
            const addedSong = await handleAddSong({ file: song, mood });
            setSubmitSuccess(`“${addedSong.title}” was added to your playlist.`);
            setsong(null);
            setMood("");
        } catch {
            setSubmitError("Couldn't upload the song. Please try again.");
        }
    }

    const fileName = song?.name || "";

    return (
        <main className="add-song-page">
            <header className="add-song-topbar">
                <button
                    className="add-song-back"
                    type="button"
                    onClick={() => navigate("/")}
                >
                    <RiArrowLeftLine />
                    <span>Back to player</span>
                </button>

                <span className="add-song-brand">
                    <RiMusic2Line /> moodify
                </span>
            </header>

            <section className="add-song-card">
                <div className="add-song-heading">
                    <span className="add-song-kicker">GROW YOUR LIBRARY</span>
                    <h1>Add a little more music.</h1>
                    <p>Share a track and we’ll match it with the right mood.</p>
                </div>

                <form className="add-song-form" onSubmit={handleSubmit}>
                    <div className="add-song-field">
                        <span className="add-song-field-label">YOUR TRACK</span>

                        <input
                            className="add-song-file-input"
                            type="file"
                            id="audio"
                            accept=".mp3,audio/mpeg"
                            onChange={(event) => {
                                setsong(event.target.files[0]);
                            }}
                        />

                        <label
                            className={`add-song-dropzone${fileName ? " add-song-dropzone--selected" : ""}`}
                            htmlFor="audio"
                        >
                            <span className="add-song-upload-icon">
                                {fileName ? <RiMusic2Line /> : <RiUploadCloud2Line />}
                            </span>

                            <span className="add-song-file-copy">
                                <strong>{fileName || "Choose an MP3 to upload"}</strong>
                                <span>
                                    {fileName ? "Selected track" : "Click to browse your files"}
                                </span>
                            </span>

                            <span className="add-song-browse">
                                {fileName ? "Change" : "Browse"}
                            </span>
                        </label>

                        <span className="add-song-hint">
                            MP3 files with embedded cover art work best.
                        </span>
                    </div>

                    <fieldset className="add-song-field add-song-moods">
                        <legend className="add-song-field-label">PICK A MOOD</legend>

                        <div className="add-song-mood-options">
                            {moods.map((option) => (
                                <label
                                    className={`add-song-mood${mood === option.value ? " add-song-mood--selected" : ""}`}
                                    key={option.value}
                                >
                                    <input
                                        className="add-song-mood-input"
                                        type="radio"
                                        name="mood"
                                        value={option.value}
                                        checked={mood === option.value}
                                        onChange={() => setMood(option.value)}
                                    />

                                    <span>{option.emoji}</span>
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {submitError && (
                        <p className="add-song-feedback add-song-feedback--error" role="alert">
                            {submitError}
                        </p>
                    )}
                    {submitSuccess && (
                        <p className="add-song-feedback add-song-feedback--success" role="status">
                            {submitSuccess}
                        </p>
                    )}

                    <button
                        className="add-song-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Add to playlist"}
                        <span>→</span>
                    </button>
                </form>
            </section>

            <p className="add-song-footer">
                The perfect soundtrack starts with you.
            </p>
        </main>
    );
}

export default AddSong;
