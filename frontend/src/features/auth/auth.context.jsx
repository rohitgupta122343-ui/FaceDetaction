import { useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({children}){

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)


    return(
        <AuthContext.Provider value={{user,loading,setloading,setuser}}>
            {children}
        </AuthContext.Provider>
    )

}