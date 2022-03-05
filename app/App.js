import React, { useState, useReducer, useEffect } from "react"
import ReactDom from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useImmerReducer } from "use-immer"
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
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import Search from "./components/Search"

Axios.defaults.baseURL = "http://localhost:8080"

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("user")),
    flashMessages: [],
    user: JSON.parse(localStorage.getItem("user")),
    isSearchOpen: false
  }

  const reducerFn = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.userData
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.payload)
        return
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFn, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("user", JSON.stringify(state.user))
    } else {
      localStorage.removeItem("user")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessage flashMessages={state.flashMessages} />
          <Header />
          <Routes>
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route
              path="/"
              element={state.loggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />}></Route>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {state.isSearchOpen && <Search />}
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
