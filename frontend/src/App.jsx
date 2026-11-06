import React from 'react'
import {RouterProvider} from 'react-router-dom'
import {appRouter} from './app.route'
import './features/shared/global.css'
import { AuthProvider } from './features/auth/auth.context'
import {SongContextProvider} from './features/home/song.context'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <SongContextProvider>
            <RouterProvider router={appRouter} />
        </SongContextProvider>
      </AuthProvider>
    </div>
  )
}

export default App