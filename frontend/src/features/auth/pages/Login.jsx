import React from 'react'
import '../style/style.css'
import {Link} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

 
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const { loading,handleLogin } = useAuth()
  const [error, setError] = useState("")

  const navigate = useNavigate()

  async function submitHandler(e){

    e.preventDefault()
    setError("")
    try {
      await handleLogin({email,password})
      navigate('/')
    } catch {
      setError("Unable to log in. Check your details and try again.")
    }

  }


  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
           <label htmlFor="email">Email:</label>
            <input value={email} onChange={(e)=>{setemail(e.target.value)}} type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input value={password} onChange={(e)=>{setpassword(e.target.value)}} type="password" id="password" name="password" required />
          </div>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
        </form>
        <p>
          Don't have an account? <Link className='navigate' to="/register">Register here</Link>
        </p>
      </div>
    </main>
  )
}
    

export default Login