import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../context/DispatchContext"

const HeaderLoggedOut = props => {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const appDispatch = useContext(DispatchContext)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", {
        username,
        password
      })
      if (response.data) {
        appDispatch({ type: "login", userData: response.data })
        appDispatch({ type: "flashMessage", payload: "Welcome back! You're successfully logged in" })
      } else {
        appDispatch({ type: "flashMessage", payload: "Oohoo! Incorrect username/password" })
      }
    } catch (error) {
      console.log(error.response.data)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input name="username" className="form-control form-control-sm input-dark" onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input name="password" className="form-control form-control-sm input-dark" onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
