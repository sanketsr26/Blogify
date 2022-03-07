import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import LoaderIcon from "./LoaderIcon"
import StateContext from "../context/StateContext"

const ProfileFollowAction = ({ action }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [followInfo, setfollowInfo] = useState([])

  const { username } = useParams()

  const appState = useContext(StateContext)

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchfollowInfo = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/${action}`, {
          cancelToken: request.token
        })
        if (response.status === 200) {
          setfollowInfo(response.data)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchfollowInfo()
    return () => {
      request.cancel()
    }
  }, [username, action])

  if (isLoading) {
    return <LoaderIcon />
  }

  return (
    <div className="list-group">
      {followInfo.length > 0 &&
        followInfo.map((follower, index) => {
          return (
            <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} />
              {follower.username}
            </Link>
          )
        })}

      {followInfo.length == 0 &&
        (action === "followers" ? (
          appState.user.username == username ? (
            <p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>
          ) : (
            <p className="lead text-muted text-center">
              {username} doesn&rsquo;t have any followers yet.
              {appState.loggedIn && " Be the first to follow them!"}
              {!appState.loggedIn && (
                <>
                  {" "}
                  If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{" "}
                </>
              )}
            </p>
          )
        ) : appState.user.username == username ? (
          <p className="lead text-muted text-center">You aren&rsquo;t following anyone yet.</p>
        ) : (
          <p className="lead text-muted text-center">{username} isn&rsquo;t following anyone yet.</p>
        ))}
    </div>
  )
}

export default ProfileFollowAction
