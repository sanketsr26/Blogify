import React, { useState } from "react"
import ReactDom from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Axios from "axios"
import About from "./components/About"
import CreatePost from "./components/CreatePost"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Terms from "./components/Terms"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessage from "./components/FlashMessages"

Axios.defaults.baseURL = "http://localhost:8080"

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("user"))
  )
  const [flashMessages, setFlashMessages] = useState([])

  const addFlashMessages = msg => {
    return setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <FlashMessage flashMessages={flashMessages} />
      <Routes>
        <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
        <Route path="/post/:id" element={<ViewSinglePost />} />
        <Route
          path="/create-post"
          element={<CreatePost addFlashMessage={addFlashMessages} />}
        />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

ReactDom.render(<App />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
