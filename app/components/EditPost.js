import React, { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import LoaderIcon from "./LoaderIcon"
import StateContext from "../context/StateContext"
import DispatchContext from "../context/DispatchContext"

const EditPost = () => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      errMsg: ""
    },
    body: {
      value: "",
      hasErrors: false,
      errMsg: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0
  }

  const reducerFn = (draft, action) => {
    switch (action.type) {
      case "postFetchComplete":
        draft.title.value = action.payload.title
        draft.body.value = action.payload.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.payload
        return
      case "bodyChange":
        draft.body.value = action.payload
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFn, initialState)

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: request.token
        })
        if (response.status === 200) {
          dispatch({ type: "postFetchComplete", payload: response.data })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPost()
    return () => {
      request.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const request = Axios.CancelToken.source()
      const editPost = async () => {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            {
              cancelToken: request.token
            }
          )
          dispatch({ type: "saveRequestFinished" })
          appDispatch({
            type: "flashMessage",
            payload: "Awesome! Post has been edited successfully."
          })
        } catch (error) {
          console.log(error)
        }
      }
      editPost()
      return () => {
        request.cancel()
      }
    }
  }, [state.sendCount])

  const handleSubmit = e => {
    e.preventDefault()
    dispatch({ type: "submitRequest" })
  }

  if (state.isFetching) {
    return (
      <Page title="Loading Post...">
        <LoaderIcon />
      </Page>
    )
  }

  return (
    <Page title="Edit Post">
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
            type="text"
            value={state.title.value}
            onChange={e =>
              dispatch({ type: "titleChange", payload: e.target.value })
            }
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
            type="text"
            value={state.body.value}
            onChange={e =>
              dispatch({ type: "bodyChange", payload: e.target.value })
            }
          />
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  )
}

export default EditPost
