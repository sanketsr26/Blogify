import React, { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import Axios from "axios"
import { useImmer } from "use-immer"
import Page from "./Page"
import StateContext from "../context/StateContext"
import ProfilePosts from "./ProfilePosts"

const Profile = () => {
  const { username } = useParams()

  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  })

  useEffect(() => {
    const request = Axios.CancelToken.source()
    console.log(username)
    const fetchProfileData = async () => {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token
          },
          { cancelToken: request.token }
        )
        setState(draft => {
          draft.profileData = response.data
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfileData()
    return () => {
      request.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const request = Axios.CancelToken.source()
      const triggerFollow = async () => {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          )
          setState(draft => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log(e)
        }
      }
      triggerFollow()
      return () => {
        request.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const request = Axios.CancelToken.source()
      const triggerUnfollow = async () => {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          )
          setState(draft => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log(e)
        }
      }
      triggerUnfollow()
      return () => {
        request.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  const handleFollowingAction = () => {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  const handleUnfollowingAction = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }

  return (
    <>
      <Page title="Profile">
        <h2>
          <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
          {state.profileData.profileUsername}
          {appState.loggedIn &&
            !state.profileData.isFollowing &&
            appState.user.username != state.profileData.profileUsername &&
            state.profileData.profileUsername != "..." && (
              <button
                className="btn btn-primary btn-sm ml-2"
                onClick={handleFollowingAction}
                disabled={state.followActionLoading}
              >
                Follow <i className="fas fa-user-plus"></i>
              </button>
            )}
          {appState.loggedIn &&
            state.profileData.isFollowing &&
            appState.user.username != state.profileData.profileUsername &&
            state.profileData.profileUsername != "..." && (
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={handleUnfollowingAction}
                disabled={state.followActionLoading}
              >
                Unfollow <i className="fas fa-user-times"></i>
              </button>
            )}
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <a href="#" className="active nav-item nav-link">
            Posts: {state.profileData.counts.postCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Followers: {state.profileData.counts.followerCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Following: {state.profileData.counts.followingCount}
          </a>
        </div>
        <ProfilePosts />
      </Page>
    </>
  )
}

export default Profile
