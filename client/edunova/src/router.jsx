import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Register from './components/public pages/register'
import Login from './components/public pages/login'
import HomePage from './components/public pages/home'
import TermsPrivacy from './components/public pages/TermPolicy'
import ForgotPassword from './components/public pages/ForgetPassword'
import ResetPassword from './components/public pages/ResetPassword'

function Routers() {
  return (
    <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/policy' element={<TermsPrivacy/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/ResetPassword' element={<ResetPassword/>}></Route>
    </Routes>
  )
}

export default Routers