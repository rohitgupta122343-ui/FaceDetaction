import axios from 'axios'

const api = axios.create({
    baseURL: 'https://facedetaction-b1dv.onrender.com/',
    withCredentials: true
})

export async function getSong({ mood }) {

    const response = await api.get('/api/songs?mood=' + mood)

    return response.data
}

export async function addSong({ file, mood }) {

    const formData = new FormData()

    formData.append('song', file)
    formData.append('mood', mood)

    const response = await api.post('/api/songs', formData)

    return response.data
}