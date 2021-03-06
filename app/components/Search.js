import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import DispatchContext from "../context/DispatchContext"
import { Link } from "react-router-dom"
import Post from "./Post"

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "noshow",
    requestCount: 0
  })

  useEffect(() => {
    document.addEventListener("keyup", handleEscapeKeypress)
    return () => {
      document.removeEventListener("keyup", handleEscapeKeypress)
    }
  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading"
      })
      const delay = setTimeout(() => {
        setState(draft => {
          //calling axios in separate useEffect using requestCount counter. Just to leverage cancelToken  for cleanup
          draft.requestCount++
        })
      }, 800)
      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = "noshow"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      const request = Axios.CancelToken.source()
      const fetchSearchResults = async () => {
        try {
          const response = await Axios.post(
            "/search",
            {
              searchTerm: state.searchTerm
            },
            {
              cancelToken: request.token
            }
          )
          setState(draft => {
            draft.results = response.data
            draft.show = "results"
          })
        } catch (error) {
          console.log(error)
        }
      }
      fetchSearchResults()
      return () => {
        request.cancel()
      }
    }
  }, [state.requestCount])

  const handleEscapeKeypress = e => {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  const handleInput = e => {
    const searchItem = e.target.value
    setState(draft => {
      draft.searchTerm = searchItem
    })
  }

  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" onChange={handleInput} placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results" + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} item(s) found)
                </div>
                {state.results.map((post, key) => {
                  return <Post onClick={() => appDispatch({ type: "closeSearch" })} post={post} key={post._id} />
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Whoops, couldn't find any result.</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
