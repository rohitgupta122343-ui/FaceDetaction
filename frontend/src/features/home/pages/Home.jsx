import React from 'react'
import FaceExpression from '../../FaceExpression/components/FaceExpression'
import MusicPlayer from '../components/MusicPlayer'
import Playlist from '../components/Playlist'
import {useSong} from '../hooks/useSong'
import { useNavigate } from 'react-router-dom'


const Home = () => {

    const {handleGetSong} = useSong()
    const navigate = useNavigate()

  return (
    <main className="home-page">
        <button onClick={()=>{navigate('/addsong')}}>Add Song</button>
        <div className="home-content">

          <FaceExpression onClick={(expression)=>{
              handleGetSong({mood:expression})
          }} />
          <Playlist />
        </div>
        <MusicPlayer />

    </main>
  )
}

export default Home