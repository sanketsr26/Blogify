import React, { useState, useReducer } from "react"
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
import StateContext from "./context/StateContext"
import DispatchContext from "./context/DispatchContext"

Axios.defaults.baseURL = "http://localhost:8080"

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("user")),
    flashMessages: []
  }
  const reducerFn = (state, action) => {
    switch (action.type) {
      case "login":
        return { loggedIn: true, flashMessages: state.flashMessages }
      case "logout":
        return { loggedIn: false, flashMessages: state.flashMessages }
      case "flashMessage":
        return {
          loggedIn: state.loggedIn,
          flashMessages: state.flashMessages.concat(action.payload)
        }
    }
  }
  const [state, dispatch] = useReducer(reducerFn, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessage flashMessages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path="/"
              element={state.loggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDom.render(<App />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
