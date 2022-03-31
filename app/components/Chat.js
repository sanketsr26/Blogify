import React, { useContext, useEffect, useRef } from "react"
import { useImmer } from "use-immer"
import DispatchContext from "../context/DispatchContext"
import StateContext from "../context/StateContext"
import io from "socket.io-client"
import { Link } from "react-router-dom"

function Chat() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  })

  const chatField = useRef(null)
  const chatLog = useRef(null)
  const socket = useRef(null)

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
      appDispatch({ type: "clearUnreadChatCount" })
    }
  }, [appState.isChatOpen])

  useEffect(() => {
    socket.current = io("http://localhost:8080/")
    //receive chat from server
    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })

    return () => socket.current.disconnect()
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    state.chatMessages.length && !appState.isChatOpen && appDispatch({ type: "incrementUnreadChatCount" })
  }, [state.chatMessages])

  const handleFieldChange = e => {
    const value = e.target.value
    setState(draft => {
      draft.fieldValue = value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    //send message to chat server
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

    setState(draft => {
      draft.chatMessages.push({ message: state.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
      draft.fieldValue = ""
    })
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((msg, index) => {
          if (appState.user.username === msg.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{msg.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={msg.avatar} />
              </div>
            )
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${msg.username}`}>
                <img className="avatar-tiny" src={msg.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${msg.username}`}>
                    <strong>{msg.username} : </strong>
                  </Link>
                  {msg.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input onChange={handleFieldChange} value={state.fieldValue} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat
