import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Register from './components/public pages/register'
import Login from './components/public pages/login'
import HomePage from './components/public pages/home'
import TermsPrivacy from './components/public pages/TermPolicy'
import ForgotPassword from './components/public pages/ForgetPassword'
import ResetPassword from './components/public pages/ResetPassword'
import CourseListing from './components/public pages/CourseListing'
import CourseDetails from './components/public pages/coursesDetails'
import AboutPage from './components/public pages/about'
import SubscriptionPage from './components/public pages/Subscription'
import FindMentorPage from './components/public pages/FindMentorPage'
import LearningDashboard from './components/users/LearningDashboard'
import InstructorRegister from './components/instructors/instructorRegister'

function Routers() {
  return (
    <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/policy' element={<TermsPrivacy/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/ResetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/courses' element={<CourseListing/>}></Route>
        <Route path='/courseDetails' element={<CourseDetails/>}></Route>
        <Route path='/about' element={<AboutPage/>}></Route>
        <Route path='/subscription' element={<SubscriptionPage/>}></Route>
        <Route path='/findMentor' element={<FindMentorPage/>}></Route>
        <Route path='/learningDashboard' element={<LearningDashboard/>}></Route>
        <Route path='/instructorRegistor' element={<InstructorRegister/>}></Route>
    </Routes>
  )
}

export default Routers