import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import StateContext from "../context/StateContext"
import Page from "./Page"
import LoaderIcon from "./LoaderIcon"
import { Link } from "react-router-dom"
import Post from "./Post"

const Home = () => {
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchFeed = async () => {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: request.token })
        setState(draft => {
          draft.isLoading = false
          draft.feed = response.data
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchFeed()
    return () => {
      request.cancel()
    }
  }, [])

  if (state.isLoading) {
    return <LoaderIcon />
  }

  return (
    <Page title="Posts">
      {state.feed.length ? (
        <>
          <h2 className="text-center mb-4">
            <strong>The Latest From Those You Follow</strong>
          </h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post post={post} key={post._id} />
            })}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </Page>
  )
}

export default Home
