import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"

const CreatePost = props => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const navigateTo = useNavigate()
  let user = JSON.parse(localStorage.getItem("user"))
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: user.access_token
      })
      //redirect after creating post
      navigateTo(`/post/${response.data}`)
    } catch (error) {
      console.log(error.response.data)
    }
  }
  return (
    <Page title="Create Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            onChange={e => setBody(e.target.value)}
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
