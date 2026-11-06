import { useContext } from "react";
import { SongContext } from "../song-context";
import { addSong, getSong } from "../services/song.service";

export function useSong() {
    const context = useContext(SongContext);

    if (!context) {
        throw new Error("useSong must be used within a SongContextProvider.");
    }

    const {
        song,
        setsong,
        playlist,
        setPlaylist,
        playlistError,
        setPlaylistError,
        loading,
        setloading
    } = context;

    const handleGetSong = async ({ mood }) => {
        setloading(true);
        setPlaylistError("");

        try {
            const response = await getSong({ mood });
            const songs = Array.isArray(response.song) ? response.song : [];

            setPlaylist(songs);
            setsong(songs[0] || null);
        } catch {
            setPlaylistError("Couldn't load songs for this mood. Please try again.");
        } finally {
            setloading(false);
        }
    };

    const handleAddSong = async ({ file, mood }) => {
        setloading(true);
        setPlaylistError("");

        try {
            const response = await addSong({ file, mood });
            const newSong = response.song;

            if (!newSong) {
                throw new Error("The upload response did not include a song.");
            }

            setPlaylist((currentPlaylist) => [
                ...currentPlaylist.filter((item) => item.url !== newSong.url),
                newSong
            ]);
            setsong(newSong);
            return newSong;
        } catch (error) {
            setPlaylistError("Couldn't add the song. Please try again.");
            throw error;
        } finally {
            setloading(false);
        }
    };

    return {
        song,
        playlist,
        playlistError,
        loading,
        selectSong: setsong,
        handleGetSong,
        handleAddSong
    };
}