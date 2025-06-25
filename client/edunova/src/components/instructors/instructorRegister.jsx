import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { instructorSchema } from '../../../schema/schema';
import { FaCloudUploadAlt } from 'react-icons/fa';

// Reusable File Input Button
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

  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      bio: '',
      skills: '',
      linkedInProfile: '',
    },
    validationSchema: instructorSchema,
    onSubmit: async (values) => {
      if (!verifiedEmail || !verifiedPhone) {
        alert("Please verify both email and phone.");
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      formData.append('avatar', avatar);
      formData.append('demoVideo', demoVideo);
      Object.entries(documents).forEach(([key, value]) => formData.append(key, value));

      try {
        await axios.post('/api/instructors/register', formData);
        alert('Registration submitted for review!');
      } catch (err) {
        alert('Error submitting registration.');
      }
    },
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
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

  const handleSendOTP = async (type) => {
    const target = type === 'email' ? formik.values.email : formik.values.phone;
    if (!target) return alert(`Please enter your ${type} first.`);
    // await axios.post(`/api/send-otp/${type}`, { target });
    alert(`OTP sent to your ${type}.`);
  };

  const handleVerifyOTP = async (type) => {
    const enteredOTP = type === 'email' ? emailOTP : phoneOTP;
    if (!enteredOTP) return alert("Enter OTP to verify.");
    // const res = await axios.post(`/api/verify-otp/${type}`, { otp: enteredOTP });
    if (type === 'email') setVerifiedEmail(true);
    if (type === 'phone') setVerifiedPhone(true);
    alert(`${type} verified!`);
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
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => handleSendOTP('email')} className="text-indigo-600 text-sm">
                  Send OTP
                </button>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  className="border px-2 py-1 rounded w-28 text-sm"
                />
                <button type="button" onClick={() => handleVerifyOTP('email')} className="text-green-600 text-sm">
                  Verify
                </button>
              </div>
              {verifiedEmail && <p className="text-green-600 text-sm">Email verified</p>}
            </div>

            {/* Phone with OTP */}
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                className={inputClass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => handleSendOTP('phone')} className="text-indigo-600 text-sm">
                  Send OTP
                </button>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                  className="border px-2 py-1 rounded w-28 text-sm"
                />
                <button type="button" onClick={() => handleVerifyOTP('phone')} className="text-green-600 text-sm">
                  Verify
                </button>
              </div>
              {verifiedPhone && <p className="text-green-600 text-sm">Phone verified</p>}
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
            <input
              name="skills"
              placeholder="Skills (comma separated)"
              className={inputClass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.skills}
            />
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

          {/* Demo Video */}
          <FileInputButton
            id="demoVideo"
            label="Demo Teaching Video"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'demoVideo')}
            file={demoVideo}
          />

          {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['degreeCertificate', 'Degree Certificate'],
              ['experienceLetter', 'Experience Letter'],
              ['certification', 'Teaching Certification'],
              ['idProof', 'Government ID'],
            ].map(([key, label]) => (
              <FileInputButton
                key={key}
                id={key}
                label={label}
                onChange={(e) => handleFileChange(e, key)}
                file={documents[key]}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-indigo-700 transition duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCloudUploadAlt />
              Submit for Review
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
