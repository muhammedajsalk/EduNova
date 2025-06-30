import React, { useEffect, useState } from 'react'
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
import InstructorDashboard from './components/instructors/instractorDahboard'
import AdminLogin from './components/admin/login'
import AdminDashboard from './components/admin/adminDashboard'
import axios from 'axios'
import { RoleProtectedRoute } from './protectedRouter'
import UserContext from './userContext'
import NotFound404 from './components/public pages/404'

function Routers() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get('http://localhost:5000/api/public/me', { withCredentials: true })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        setUser(null)
        console.log(err.response?.data?.message || err.message)
      }
      ).finally(()=>{
        setLoading(false)
      })
  }, [])
  return (
    <UserContext.Provider value={{user,setUser}}>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/policy' element={<TermsPrivacy />}></Route>
        <Route path='/ForgotPassword/:role' element={<ForgotPassword />}></Route>
        <Route path='/ResetPassword/:token/:role' element={<ResetPassword />}></Route>
        <Route path='/courses' element={<CourseListing />}></Route>
        <Route path='/courseDetails' element={<CourseDetails />}></Route>
        <Route path='/about' element={<AboutPage />}></Route>
        <Route path='/subscription' element={<SubscriptionPage />}></Route>
        <Route path='/findMentor' element={<FindMentorPage />}></Route>
        <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['user']} />}>
          <Route path='/learningDashboard' element={<LearningDashboard />}></Route>
        </Route>
        <Route path='/instructorRegistor' element={<InstructorRegister />}></Route>
        <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['instructor']} />}>
          <Route path='/instructorDashBoard' element={<InstructorDashboard />}></Route>
        </Route>
        <Route path='/adminLogin' element={<AdminLogin />}></Route>
        <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
          <Route path='/adminDashBoard' element={<AdminDashboard />}></Route>
        </Route>
        <Route path='/notFound' element={<NotFound404/>}></Route>
      </Routes>
    </UserContext.Provider>

  )
}

export default React.memo(Routers)