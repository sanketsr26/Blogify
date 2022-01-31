import React from "react"
import { Link } from "react-router-dom"

const HeaderLoggedIn = props => {
  const handleSignOut = e => {
    e.preventDefault()
    localStorage.removeItem("user")
    props.setLoggedIn(false)
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
