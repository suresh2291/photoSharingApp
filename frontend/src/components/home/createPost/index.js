import React from 'react'
import "./style.css"
import { Feeling, LiveVideo, Photo } from '../../../svg'

// This function creates a post and takes in two props: user and setPostVisible
// user is an object representing the currently logged in user, and setPostVisible is a function to change post visibility.
export default function CreatePost({user, setPostVisible}) {
  return (
    // This div contains the create post input form.
    <div className="create_post">
        {/* This div contains the header of the create post form. */}
        <div className="create_post_header">
            {/* This img element displays the profile picture of the current user. */}
            <img src={user?.picture} alt="" />
            {/* This div contains the "what's on your mind?" text, which, when clicked, sets post visibility to true. */}
            <div className="open_post hover2" onClick={()=>{setPostVisible(true)}}>
               What's on your mind, {user?.firstName}?
            </div>
        </div>
        {/* This div creates a horizontal line between the header and body. */}
        <div className="create_splitter"></div>
        {/* This div contains options for adding photos or other content to the post. */}
        <div className="create_post_body">
            {/* This div displays an icon for adding photos, which when clicked sets post visibility to true. */}
            <div className="create_post_icon" onClick={()=>{setPostVisible(true)}}>
                <Photo color="#4bbf67"/>
                Photos
            </div>
            {/* This div would have displayed an icon for adding feelings or activities, but it has been commented out. */ }
            {/* <div className="create_post_icon hover1">
                <Feeling color="#f7b928"/>
                Feeling/Activity
            </div> */}
        </div>
    </div>
  )
}
