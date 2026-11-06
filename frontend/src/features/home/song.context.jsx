import { useState } from "react";
import { createContext } from "react";
export const SongContext = createContext();


const initialSong = {
    url: 'https://ik.imagekit.io/0wmauyftj/moodify2/songs/Jaavi_Na__DownloadMing.WS__xKtevmX7c.mp3',
    posterImg: 'https://ik.imagekit.io/0wmauyftj/moodify2/poster/Jaavi_Na__DownloadMing.WS__P-oHxVp90.jpeg',
    title: 'Jaavi Na [DownloadMing.WS]',
    mood: 'neutral',
}

export function SongContextProvider({children}){

    const [loading, setloading] = useState(false)
    const [song, setsong] = useState(initialSong)
    const [playlist, setPlaylist] = useState([initialSong])
    const [playlistError, setPlaylistError] = useState("")

    return(
        <SongContext.Provider value={{
            song,
            setsong,
            playlist,
            setPlaylist,
            playlistError,
            setPlaylistError,
            loading,
            setloading
        }}>
            {children}
        </SongContext.Provider>
    )

}