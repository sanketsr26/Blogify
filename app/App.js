import React, { useState } from "react"
import ReactDom from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import About from "./components/About"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Terms from "./components/Terms"

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("user"))
  )
  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
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
