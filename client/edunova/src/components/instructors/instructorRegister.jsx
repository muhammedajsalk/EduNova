import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { instructorSchema } from '../../../schema/schema';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FileInputButton = ({ id, label, onChange, accept, file }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-700 font-medium">{label}</label>
    <div className="flex items-center gap-3">
      <label
        htmlFor={id}
        className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Choose File
      </label>
      <span className="text-sm text-gray-600">{file ? file.name : 'No file chosen'}</span>
    </div>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      className="hidden"
    />
  </div>
);

export default function InstructorRegister() {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [demoVideo, setDemoVideo] = useState(null);
  const [documents, setDocuments] = useState({
    degreeCertificate: null,
    experienceLetter: null,
    certification: null,
    idProof: null,
  });

  const navigate = useNavigate()

  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submiting, setSubmiting] = useState(false)
  const [otpSentIn, setOtpSentIn] = useState(true)
  const [verifiedEmailIn, setVerifiedEmailIn] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      skills: '',
      linkedInProfile: '',
      avatar: null,
      demoVideo: null,
      degreeCertificate: null,
      experienceLetter: null,
      certification: null,
      idProof: null,
    },
    validationSchema: instructorSchema,
    onSubmit: async () => {
      if (!verifiedEmail) {
        alert("Please verify the email.");
        return;
      }

      setSubmiting(true)

      const formData = new FormData();

      const textFields = ['name', 'email', 'password', 'bio', 'skills', 'linkedInProfile'];
      textFields.forEach(field => {
        formData.append(field, formik.values[field]);
      });

      if (avatar) formData.append('avatar', avatar);
      if (demoVideo) formData.append('demoVideo', demoVideo);
      Object.entries(documents).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      try {
        const res = await axios.post('http://localhost:5000/api/instructor/auth/register', formData);
        setTimeout(() => {
          toast.success(res.data.message);
          navigate('/login')
          setSubmiting(false)
        }, 3000);
      } catch (err) {
        setSubmiting(false)
        toast.error(err.response?.data?.message || err.message);
      }
    }

  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    formik.setFieldValue(field, file)
    if (!file) return;
    if (field in documents) setDocuments((prev) => ({ ...prev, [field]: file }));
    else if (field === 'avatar') {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else if (field === 'demoVideo') {
      setDemoVideo(file);
    }
  };

  const inputClass = 'border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400';


  const handleSendOTP = async () => {
    setTimeout(() => {
      setOtpSentIn(true)
      setVerifiedEmailIn(false)
    }, 180000);
    const target = formik.values.email
    if (!target) return toast.warning("please enter your email");
    setSendingOtp(true)
    axios.post("http://localhost:5000/api/users/auth/otpSent", { email: formik.values.email, role: "instructor" })
      .then((res) => {
        toast.success(res.data.message)
        setOtpSentIn(false)
        setVerifiedEmailIn(true)
      })
      .catch((err) => {
        console.error("OTP send error:", err.response?.data?.message || err.message)
        setOtpSentIn(true)
        setVerifiedEmailIn(false)
        toast.error(err.response?.data?.message || err.message)
      })
      .finally(() => {
        setSendingOtp(false);
      });
  };


  const handleVerifyOTP = async () => {
    const enteredOTP = emailOTP
    if (!enteredOTP) return toast.warning("Enter OTP to verify.");
    const email = formik.values.email
    axios.post('http://localhost:5000/api/instructor/auth/emailVerify', { email, role: "instructor", otp: emailOTP })
      .then((res) => {
        setVerifiedEmail(true)
        toast.success(res.data.message)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message)
      }
      )
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Instructor Registration</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <input
                name="name"
                placeholder="Full Name"
                className={inputClass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            {/* Email with OTP */}
            <div>
              <input
                name="email"
                placeholder="Email"
                type="email"
                className={inputClass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
              <div className="flex gap-2 mt-2">
                {otpSentIn && (
                  <button type="button" onClick={() => handleSendOTP('email')} className="w-30 border text-white border-gray-300 px-2 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700" disabled={sendingOtp}>
                    {sendingOtp ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Get OTP"
                    )}
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  className="border px-2 py-1 rounded w-28 text-sm"
                />
                {verifiedEmailIn && (
                  <button type="button" onClick={() => handleVerifyOTP('email')} className="text-green-600 text-sm">
                    Verify
                  </button>
                )}
              </div>
              {verifiedEmail && <p className="text-green-600 text-sm">Email verified</p>}
            </div>
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={inputClass}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {/* Avatar */}
          <FileInputButton
            id="avatar"
            label="Upload Avatar"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
            file={avatar}
          />
          {formik.touched.avatar && formik.errors.avatar && (
            <p className="text-red-500 text-sm">{formik.errors.avatar}</p>
          )}
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="mt-2 w-20 h-20 object-cover rounded-full border"
            />
          )}

          {/* Bio and Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              name="bio"
              rows="4"
              placeholder="Short bio..."
              className={inputClass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
            />
            {formik.touched.bio && formik.errors.bio && (
              <p className="text-red-500 text-sm">{formik.errors.bio}</p>
            )}
            <input
              name="skills"
              placeholder="Skills (comma separated)"
              className={inputClass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.skills}
            />
            {formik.touched.skills && formik.errors.skills && (
              <p className="text-red-500 text-sm">{formik.errors.skills}</p>
            )}
          </div>

          {/* LinkedIn */}
          <input
            name="linkedInProfile"
            placeholder="LinkedIn Profile URL"
            className={inputClass}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.linkedInProfile}
          />
          {formik.touched.linkedInProfile && formik.errors.linkedInProfile && (
            <p className="text-red-500 text-sm">{formik.errors.linkedInProfile}</p>
          )}

          {/* Demo Video */}
          <FileInputButton
            id="demoVideo"
            label="Demo Teaching Video"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'demoVideo')}
            file={demoVideo}
          />
          {formik.touched.demoVideo && formik.errors.demoVideo && (
            <p className="text-red-500 text-sm">{formik.errors.demoVideo}</p>
          )}

          {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['degreeCertificate', 'Degree Certificate'],
              ['experienceLetter', 'Experience Letter'],
              ['certification', 'Teaching Certification'],
              ['idProof', 'Government ID'],
            ].map(([key, label]) => (
              <div key={key}>
                <FileInputButton
                  id={key}
                  label={label}
                  onChange={(e) => handleFileChange(e, key)}
                  file={documents[key]}
                />
                {formik.touched[key] && formik.errors[key] && (
                  <p className="text-red-500 text-sm">{formik.errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            disabled={submiting}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-indigo-700 transition duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              {submiting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <FaCloudUploadAlt />
                  Submiting...
                </>
              ) : (
                <FaCloudUploadAlt />,
                "Submit for Review"
              )}
            </div>
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
