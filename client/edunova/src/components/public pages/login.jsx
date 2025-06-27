import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useFormik } from 'formik'
import { LoginSceama } from '../../../schema/schema';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';




function Login() {
    const [role, setRole] = useState("student");
    const [submiting, setSubmiting] = useState(false)


    const navigate = useNavigate()

    const initialValue = {
        name: "",
        email: "",
        password: ""
    }

    function loginAccount(values) {
        if (role === "student") {
            setSubmiting(true)
            axios.post("http://localhost:5000/api/users/auth/login", values, { withCredentials: true })
                .then((res) => {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        navigate('/learningDashboard')
                    }, 2000);
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
                .finally(()=>setSubmiting(false))
        } else {
            setSubmiting(true)
            axios.post("http://localhost:5000/api/instructor/auth/login", values, { withCredentials: true })
                .then((res) => {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        navigate('/instructorDashBoard')
                    }, 2000);
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
                .finally(()=>setSubmiting(false))
        }
    }

    const { values, handleBlur, handleSubmit, handleChange, errors, touched } = useFormik({
        initialValues: initialValue,
        validationSchema: LoginSceama,
        onSubmit: (values) => {
            loginAccount(values)
        }
    })
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            {role === "student" ? (
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
                        <img
                            src="https://media.istockphoto.com/id/2105091005/photo/young-student-taking-notes-while-e-learning-on-laptop-at-the-university.jpg?s=612x612&w=0&k=20&c=5AoTWNFmHm-HeQfx0FzB3LPm3MKQXgokYelEvmC_47E="
                            alt="instructor"
                            className="rounded-lg w-full h-64 object-cover mb-6"
                        />
                        <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Start Your Student Journey</h2>
                        <p className="text-gray-600 text-center text-sm md:text-base">
                            Join thousands of instructors sharing their knowledge
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 p-8 md:p-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Login Account</h2>
                        <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden w-full max-w-xs">
                            <button
                                onClick={() => setRole("student")}
                                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "student" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                onClick={() => setRole("instructor")}
                                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "instructor" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                                    }`}
                            >
                                Instructor
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    setSubmiting(true)
                                    axios.post('http://localhost:5000/api/users/auth/login', credentialResponse, { withCredentials: true })
                                        .then((res) => {
                                            toast.success(res.data.message)
                                            setTimeout(() => {
                                                navigate('/learningDashboard')
                                            }, 2000);
                                        })
                                        .catch((err) => {
                                            const msg = err.response?.data?.message || err.message;
                                            toast.error(msg)
                                        }
                                        ).finally(()=>{
                                            setSubmiting(false)
                                        })
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
                        </div>
                        <div className="flex items-center my-4">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <span className="px-3 text-gray-500 text-sm">or</span>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className='flex'>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                                    name="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && touched.email && (<p className="text-red-500">{errors.email}</p>)}
                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                                name="password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.password && touched.password && (<p className="text-red-500">{errors.password}</p>)}
                            <Link to={"/ForgotPassword/user"}><p className="text-indigo-600">Forget Password?</p></Link>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                            >
                                {submiting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Loging...
                                    </>
                                ) : (
                                    "Login Account"
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            <Link to={'/policy'}>
                                By signing up, you agree to our <span className="text-indigo-600 underline">Terms of Service</span> and <span className="text-indigo-600 underline">Privacy Policy</span>.
                            </Link>
                        </p>

                        <p className="text-sm text-center mt-4">
                            create an account? <Link to={'/register'}><span className="text-indigo-600 font-medium">Sign up</span></Link>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
                        <img
                            src="https://media.istockphoto.com/id/1288103838/photo/lady-sitting-at-desk-using-computer-and-waving-to-webcam.jpg?s=612x612&w=0&k=20&c=rSku-Ifqf1zWKTS0AkYII0NOXEnN3ylNCvP5hyftnaQ="
                            alt="Instructor"
                            className="rounded-lg w-full h-64 object-cover mb-6"
                        />
                        <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Start Your Instructor Journey</h2>
                        <p className="text-gray-600 text-center text-sm md:text-base">
                            Share to lakhs of student your knowledge
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 p-8 md:p-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Login Account</h2>
                        <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden w-full max-w-xs">
                            <button
                                onClick={() => setRole("student")}
                                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "student" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                onClick={() => setRole("instructor")}
                                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "instructor" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                                    }`}
                            >
                                Instructor
                            </button>
                        </div>
                        <div className="space-y-3 mb-6">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    setSubmiting(true)
                                    axios.post('http://localhost:5000/api/instructor/auth/login', credentialResponse, { withCredentials: true })
                                        .then((res) => {
                                            toast.success(res.data.message)
                                            setTimeout(() => {
                                                navigate('/instructorDashBoard')
                                            }, 2000);
                                        })
                                        .catch((err) => {
                                            const msg = err.response?.data?.message || err.message;
                                            toast.error(msg)
                                        }
                                        ).finally(()=>{
                                            setSubmiting(false)
                                        })
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className='flex'>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                                    name="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && touched.email && (<p className="text-red-500">{errors.email}</p>)}
                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                                name="password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.password && touched.password && (<p className="text-red-500">{errors.password}</p>)}
                            <Link to={"/ForgotPassword/instructor"}><p className="text-indigo-600">Forget Password?</p></Link>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                            >
                                {submiting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Loging...
                                    </>
                                ) : (
                                    "Login Account"
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            <Link to={'/policy'}>
                                By signing up, you agree to our <span className="text-indigo-600 underline">Terms of Service</span> and <span className="text-indigo-600 underline">Privacy Policy</span>.
                            </Link>
                        </p>

                        <p className="text-sm text-center mt-4">
                            create an account? <Link to={'/register'}><span className="text-indigo-600 font-medium">Sign up</span></Link>
                        </p>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    )
}

export default Login