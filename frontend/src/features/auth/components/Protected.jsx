
import {useAuth} from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'


export function Protected({children}){


    const {user,loading} = useAuth()

    if(loading){
        return(
            <main>
                <h1>Loading...</h1>
            </main>
        )
    }

    if(!user){
        return <Navigate to="/login" />
    }

    return children
}