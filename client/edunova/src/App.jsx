import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Routers from './router'

function App() {
  return (
   <BrowserRouter>
       <Routers/>
   </BrowserRouter>
  )
}


export default React.memo(App)
