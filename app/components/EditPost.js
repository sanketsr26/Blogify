import React, { useEffect, useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import LoaderIcon from "./LoaderIcon"
import StateContext from "../context/StateContext"
import DispatchContext from "../context/DispatchContext"
import NotFound from "./NotFound"

const EditPost = () => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const navigateTo = useNavigate()

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
    sendCount: 0,
    notFound: false
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
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleValidation":
        if (!action.payload.trim()) {
          draft.title.hasErrors = true
          draft.title.errMsg = "You must provide title"
        }
        return
      case "bodyValidation":
        if (!action.payload.trim()) {
          draft.body.hasErrors = true
          draft.body.errMsg = "You must provide body content"
        }
        return
      case "postNotFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFn, initialState)

  const handleSubmit = e => {
    e.preventDefault()
    dispatch({ type: "titleValidation", payload: state.title.value })
    dispatch({ type: "bodyValidation", payload: state.body.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: request.token
        })
        if (response.data) {
          dispatch({ type: "postFetchComplete", payload: response.data })
          if (appState.user.username !== response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              payload: "You do not have permission to edit this post"
            })
            //redirect
            navigateTo(`/post/${state.id}`)
          }
        } else {
          dispatch({ type: "postNotFound" })
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

  if (state.notFound) {
    return <NotFound />
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
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to Post
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
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
            onBlur={e => dispatch({ type: "titleValidation", payload: e.target.value })}
            onChange={e => dispatch({ type: "titleChange", payload: e.target.value })}
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">{state.title.errMsg}</div>
          )}
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
            onBlur={e => dispatch({ type: "bodyValidation", payload: e.target.value })}
            onChange={e => dispatch({ type: "bodyChange", payload: e.target.value })}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">{state.body.errMsg}</div>
          )}
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  )
}

export default EditPost
