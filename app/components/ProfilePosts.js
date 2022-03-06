import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import LoaderIcon from "./LoaderIcon"

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
      {posts.map((post, key) => {
        const date = new Date(post.createdDate)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small">on {formattedDate} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
