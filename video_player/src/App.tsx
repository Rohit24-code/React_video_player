import { useState } from 'react'
import MyVideo from './assets/video.mp4';
import thumbNail from './assets/thumb2.jpg'
import './App.css'
import VideoPlayer from './components/videoPlayer'


function App() {


  return (
    <>
    <div>Video Player</div>

    <div>
    <VideoPlayer
     src={MyVideo}
     thumbNail={thumbNail}
    />
    </div>
    </>
  )
}

export default App
