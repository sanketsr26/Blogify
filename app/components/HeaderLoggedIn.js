import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import DispatchContext from "../context/DispatchContext"
import StateContext from "../context/StateContext"
import ReactTooltip from "react-tooltip"

const HeaderLoggedIn = props => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const navigateTo = useNavigate()

  const handleSignOut = e => {
    e.preventDefault()
    appDispatch({ type: "logout" })
    navigateTo("/")
    //addFlashMessages("You are logged out!")
  }

  const handleSearchIcon = e => {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  const handleToggleChat = e => {
    e.preventDefault()
    appDispatch({ type: "toggleChat" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon" data-tip="Search" data-for="search">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip id="search" className="custom-tooltip" />{" "}
      <span onClick={handleToggleChat} className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")} data-tip="Chat" data-for="chat">
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
      </span>{" "}
      <ReactTooltip id="chat" className="custom-tooltip" />
      <Link to={`/profile/${appState.user.username}`} className="mr-2" data-tip="My Profile" data-for="my profile">
        <img className="small-header-avatar" src={appState.user ? appState.user.avatar : ""} />
      </Link>{" "}
      <ReactTooltip id="my profile" className="custom-tooltip" />
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button className="btn btn-sm btn-secondary" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
