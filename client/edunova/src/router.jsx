import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Register from './components/public pages/register'
import Login from './components/public pages/login'

function Routers() {
  return (
    <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
    </Routes>
  )
}

export default Routers