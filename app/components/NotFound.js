import React from "react"
import { Link } from "react-router-dom"
import Page from "./Page"

const NotFound = () => {
  return (
    <Page title="Post Not Found">
      <div className="text-center">
        <h2>Whoops, page not found.</h2>
        <p className="lead text-muted">
          Please visit the <Link to="/">homepage</Link>.
        </p>
      </div>
    </Page>
  )
}

export default NotFound
