
import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const {loading,handleRegister } = useAuth()
  const [error, setError] = useState("")

  const navigate = useNavigate()


  const submitHandler = async(e)=>{

    e.preventDefault()
    setError("")
    try {
      await handleRegister({username,email,password})
      navigate('/login')
    } catch {
      setError("Unable to create your account. Please check your details and try again.")
    }
  }

  if(loading){
    return(
      <main><h1>Loading...</h1></main>
    )
  }

  return (
    <main className="register-page">
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input value={username} onChange={(e)=>{setusername(e.target.value)}} type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input value={email} onChange={(e)=>{setemail(e.target.value)}} type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input value={password} onChange={(e)=>{setpassword(e.target.value)}} type="password" id="password" name="password" required />
          </div>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Creating account…" : "Register"}</button>
        </form>
        <p>
          Already have an account? <Link className='navigate' to="/login">Login here</Link>
        </p>
      </div>
    </main>
  )
}

export default Register