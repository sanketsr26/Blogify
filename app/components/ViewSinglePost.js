import React, { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import Page from "./Page"
import LoaderIcon from "./LoaderIcon"
import NotFound from "./NotFound"
import StateContext from "../context/StateContext"
import DispatchContext from "../context/DispatchContext"

const ViewSinglePost = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const navigateTo = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token
        })
        if (response.status === 200) {
          setPost(response.data)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPost()
    return () => {
      request.cancel()
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading) {
    return (
      <Page title="Loading Post...">
        <LoaderIcon />
      </Page>
    )
  }

  const isAuthor = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  const deleteHandler = async () => {
    const deleteFlag = window.confirm("Do you really want to delete this post?")
    if (deleteFlag) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token }
        })
        if (response.data == "Success") {
          appDispatch({
            type: "flashMessage",
            payload: "Cool! Post has been successfully deleted."
          })
          //redirect
          navigateTo(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isAuthor() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} className="text-primary mr-2" data-tip="Edit" data-for="edit">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} className="delete-post-button text-danger" data-tip="Delete" data-for="delete">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
