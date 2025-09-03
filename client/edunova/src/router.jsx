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
import AdminLogin from './components/admin/login'
import AdminDashboard from './components/admin/adminDashboard'
import axios from 'axios'
import { RoleProtectedRoute } from './protectedRouter'
import UserContext from './userContext'
import NotFound404 from './components/public pages/404'
import InstructorAllShow from './components/admin/instructorAllShow'
import InstructorPendingSection from './components/admin/instructorPendingSection'
import InstructorVerificationSection from './components/admin/instructorVerificationSection'
import InstructorDetailsPage from './components/admin/instructorDetailsPage'
import InstructorDetailsAndDocumentsView from './components/admin/instructorDetailsAndDocumentsView'
import StudentAllShow from './components/admin/studentAllShow'
import UserDetailsPage from './components/admin/userDetailsPage'
import CourseGrid from './components/instructors/instructor page/instructorAllCourse'
import InstructorLayout from './components/instructors/instructor layout/instractorLayout'
import InstructorHome from './components/instructors/instructor page/instructorHome'
import DashboardLayout from './components/instructors/instructor layout/instractorLayout'
import InstructorAllCourse from './components/instructors/instructor page/instructorAllCourse'
import CreateCourse from './components/instructors/instructor page/instructorCourseCreation'
import CoursesAllShow from './components/admin/coursesAllShow'
import CoursePendingSection from './components/admin/coursePendingSection'
import CourseApproval from './components/admin/coursesVerificationSection'
import CourseDetailsPage from './components/admin/courseDetailsSection'
import CourseViewPage from './components/instructors/instructor page/courseView'
import CourseEntrollSection from './components/users/courseEntrollSection'
import InstructorTerms from './components/instructors/instructorTermAndCondition'
import Layout from './components/layout/layout'
import UserDashboardLayout from './components/users/userLayout/userLayout'
import PaymentTransactionsDashboard from './components/admin/allPaymentSection'
import AdminRevenew from './components/admin/adminRevenewPage'
import PayoutsDashboard from './components/admin/allPayOutSection'
import { PublicPageAccess } from './publicPageAccess'
import UserCourses from './components/users/userCourses'
import CourseVideoPlayer from './components/users/courseWatch'
import MentorshipProgramCreator from './components/instructors/instructor page/instructorMentorshipCreation'
import ScheduledStudents from './components/instructors/instructor page/enteredMentorshipStudents'
import InstructorBooking from './components/users/mentorshipDeatils'

function Routers() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get('http://localhost:5000/api/public/me', { withCredentials: true })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        setUser(null)
      }
      ).finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout>
        <Routes>
          <Route element={<PublicPageAccess user={user} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path='/courses' element={<CourseListing />}></Route>
            <Route path='/courseDetails' element={<CourseDetails />}></Route>
            <Route path='/subscription' element={<SubscriptionPage />}></Route>
            <Route path='/findMentor' element={<FindMentorPage />}></Route>
          </Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/policy' element={<TermsPrivacy />}></Route>
          <Route path='/insrtuctor/terms' element={<InstructorTerms />}></Route>
          <Route path='/ForgotPassword/:role' element={<ForgotPassword />}></Route>
          <Route path='/ResetPassword/:token/:role' element={<ResetPassword />}></Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['user']} />}>
            <Route path='/learningDashboard' element={<LearningDashboard />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['user', "instructor"]} />}>
            <Route path='/courseEntrollSection/:id' element={<CourseEntrollSection />}></Route>
            <Route path='/findMentor/mentorsDetails/:id' element={<InstructorBooking/>} />
          </Route>
          <Route path='/instructorRegistor' element={<InstructorRegister />}></Route>
          <Route path='/adminLogin' element={<AdminLogin />}></Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/adminDashBoard' element={<AdminDashboard />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/adminRevenew' element={<AdminRevenew />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/courseManagement' element={<CoursesAllShow />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/instructorManagement' element={<InstructorAllShow />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/instructor_Pending_Section' element={<InstructorPendingSection />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/payment_transaction' element={<PaymentTransactionsDashboard />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/payout' element={<PayoutsDashboard />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/course_Pending_Section' element={<CoursePendingSection />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/course_verification_section/:id' element={<CourseApproval />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/instructor_verification_section/:id' element={<InstructorVerificationSection />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/instructor_details/:id' element={<InstructorDetailsPage />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/instructor_details_and_documents/:id' element={<InstructorDetailsAndDocumentsView />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/studentsManagement' element={<StudentAllShow />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/user_details/:id' element={<UserDetailsPage />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['admin']} />}>
            <Route path='/admin/courseDetails/:id' element={<CourseDetailsPage />}></Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['instructor']} />}>
            <Route path="/instructorDashboard" element={<DashboardLayout />}>
              <Route index element={<InstructorHome />} />
              <Route path="courses" element={<InstructorAllCourse />} />
              <Route path='createCourse' element={<CreateCourse />}></Route>
              <Route path='CourseView/:id' element={<CourseViewPage />}></Route>
              <Route path='Mentorship/scheduledStudent' element={<ScheduledStudents />}></Route>
              <Route path='Mentorship/scheduledStudent/creation' element={<MentorshipProgramCreator/>}></Route>
            </Route>
          </Route>
          <Route element={<RoleProtectedRoute user={user} loading={loading} allowedRoles={['user']} />}>
            <Route path="/learningDashboard" element={<UserDashboardLayout />}>
              <Route index element={<LearningDashboard />} />
              <Route path='courses' element={<UserCourses/>} />
              <Route path='courseWatching/:id' element={<CourseVideoPlayer/>} />
              <Route path='courseWatching/:id' element={<CourseVideoPlayer/>} />
            </Route>
          </Route>
          <Route path='/notFound' element={<NotFound404 />}></Route>
        </Routes>
      </Layout>
    </UserContext.Provider>

  )
}

export default React.memo(Routers)