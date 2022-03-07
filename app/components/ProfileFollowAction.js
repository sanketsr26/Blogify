import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import LoaderIcon from "./LoaderIcon"

const ProfileFollowAction = ({ action }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [followInfo, setfollowInfo] = useState([])

  const { username } = useParams()

  console.log(action)

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
    </div>
  )
}

export default ProfileFollowAction
