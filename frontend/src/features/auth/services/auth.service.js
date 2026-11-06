
import axios from 'axios'


const api = axios.create({
    baseURL : 'http://localhost:3000',
    withCredentials:true
})

export async function login({username,email,password}){

    const respones = await api.post('/api/auth/login',{
        username,email,password
    })

    return respones.data

}

export async function register({username,email,password}){

    const respones = await api.post('/api/auth/register',{
        username,email,password
    })

    return respones.data

}

export async function getMe(){

    const respones = await api.get('/api/auth/get-me')

    return respones.data

}

export async function logout(){

    const respones = await api.post('/api/auth/logout')

    return respones.data
}