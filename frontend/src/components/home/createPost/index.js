import React from 'react'
import "./style.css"
import { Feeling, LiveVideo, Photo } from '../../../svg'

export default function CreatePost({user}) {
  return (
    <div className="create_post_form">
        <div className="create_post_form_header">
        <img src={user?.picture} alt="" />
        <div className="open_post">
           What's on your mind, {user?.firstName}?
        </div>
        </div>
        <div className="create_splitter"></div>
        <div className="create_post_body">
            <div className="create_post_icon hover1">
                <Photo color="#4bbf67"/>
                Photos
            </div>
            <div className="create_post_icon hover1">
                <Feeling color="#f7b928"/>
                Feeling/Activity
            </div>
            <div className="create_post_icon hover1">
                <LiveVideo color="#f3425f"/>
                Photos
            </div>
        </div>
    </div>
  )
}
