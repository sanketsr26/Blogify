import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import DispatchContext from "../context/DispatchContext"

const HeaderLoggedIn = props => {
  const appDispatch = useContext(DispatchContext)
  const navigateTo = useNavigate()
  const handleSignOut = e => {
    e.preventDefault()
    appDispatch({ type: "logout" })
    localStorage.removeItem("user")
    navigateTo("/")
    //addFlashMessages("You are logged out!")
  }
  let user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img className="small-header-avatar" src={user ? user.avatar : ""} />
      </a>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button className="btn btn-sm btn-secondary" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
