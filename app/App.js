import React from "react"
import ReactDom from "react-dom"

const App = () => {
  return (
    <>
      <h1>Welcome To Blogify</h1>
    </>
  )
}

ReactDom.render(<App />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
