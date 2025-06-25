import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from "formik";
import { ResetPasswordSceama } from "../../../schema/schema";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const initialValues = {
        password: "",
        cpassword: ""
    }

    const { values, handleBlur, handleSubmit, handleChange, errors, touched } = useFormik(
        {
            initialValues,
            validationSchema: ResetPasswordSceama,
            onSubmit: async (values) => {
                try {
                    const res = await axios.post("http://localhost:5000/api/users/auth/resetPassword", {
                        token,
                        password: values.password
                    });
                    toast.success(res.data.message);
                    setTimeout(() => navigate("/login"), 4000);
                } catch (err) {
                    toast.error(err.response?.data?.message || err.message);
                }
            }
        }
    )



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Reset Your Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 border rounded mb-3"
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {errors.password && touched.password && (<p className="text-red-500">{errors.password}</p>)}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="cpassword"
                    className="w-full p-2 border rounded mb-3"
                    value={values.cpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.cpassword && touched.cpassword && (<p className="text-red-500">{errors.cpassword}</p>)}
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    Reset Password
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
