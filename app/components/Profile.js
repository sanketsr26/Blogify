import React, { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import StateContext from "../context/StateContext"
import ProfilePosts from "./ProfilePosts"

const Profile = () => {
  const { username } = useParams()

  const appState = useContext(StateContext)

  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    counts: { postCount: "", followerCount: "", followingCount: "" }
  })

  useEffect(() => {
    const request = Axios.CancelToken.source()
    const fetchProfileData = async () => {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token
          },
          { cancelToken: request.token }
        )
        setProfileData(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfileData()
    return () => {
      request.cancel()
    }
  }, [])

  return (
    <>
      <Page title="Profile">
        <h2>
          <img className="avatar-small" src={profileData.profileAvatar} />{" "}
          {profileData.profileUsername}
          <button className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <a href="#" className="active nav-item nav-link">
            Posts: {profileData.counts.postCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Followers: {profileData.counts.followerCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Following: {profileData.counts.followingCount}
          </a>
        </div>
        <ProfilePosts />
      </Page>
    </>
  )
}

export default Profile
