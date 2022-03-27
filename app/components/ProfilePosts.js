import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import LoaderIcon from "./LoaderIcon"
import Post from "./Post"

const ProfilePosts = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const { username } = useParams()

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token
        })
        if (response.status === 200) {
          setPosts(response.data)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
    return () => {
      request.cancel()
    }
  }, [username])

  if (isLoading) {
    return <LoaderIcon />
  }

  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post post={post} key={post._id} noAuthor={true} />
      })}
    </div>
  )
}

export default ProfilePosts
