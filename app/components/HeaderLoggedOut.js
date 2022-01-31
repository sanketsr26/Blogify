import React, { useState } from "react"
import Axios from "axios"

const HeaderLoggedOut = props => {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", {
        username,
        password
      })
      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            access_token: response.data.token,
            username: response.data.username,
            avatar: response.data.avatar
          })
        )
        props.setLoggedIn(true)
      } else {
        console.log("Error: Incorrect username/password")
      }
    } catch (error) {
      console.log(error.response.data)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
