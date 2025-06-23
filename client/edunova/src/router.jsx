import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Register from './components/public pages/register'

function Routers() {
  return (
    <Routes>
        <Route path='/register' element={<Register/>}></Route>
    </Routes>
  )
}

export default Routers