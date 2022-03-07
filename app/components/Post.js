import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function Post(props) {
  const date = new Date(props.post.createdDate)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return (
    <Link onClick={props.onClick} key={props.key} to={`/post/${props.post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={props.post.author.avatar} /> <strong>{props.post.title}</strong>{" "}
      <span className="text-muted small">
        by {props.post.author.username} on {formattedDate}{" "}
      </span>
    </Link>
  )
}

export default Post
