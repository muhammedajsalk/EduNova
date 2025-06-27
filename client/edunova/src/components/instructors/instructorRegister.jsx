import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { instructorSchema } from '../../../schema/schema';
import { FaCloudUploadAlt, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FileInput = ({ id, label, accept, onChange, file, type = 'document' }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-medium text-sm text-gray-700">
      {label} {type === 'avatar' ? '' : '*'}
    </label>
    <label
      htmlFor={id}
      className={`w-full border-2 border-dashed ${
        type === 'avatar' ? 'rounded-full aspect-square w-40 h-40 mx-auto' : 'rounded-md p-4'
      } border-gray-300 text-center cursor-pointer text-gray-600 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center`}
    >
      {type === 'avatar' ? (
        file ? (
          <img 
            src={typeof file === 'string' ? file : URL.createObjectURL(file)} 
            alt="Avatar preview" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center">
              <FaUser className="text-5xl text-gray-400" />
            </div>
            <span className="mt-2 text-sm">Upload Avatar</span>
          </div>
        )
      ) : (
        <>
          <FaCloudUploadAlt className="inline-block mr-2 text-xl mb-1" />
          {file ? file.name : 'Upload File'}
        </>
      )}
    </label>
    <input
      type="file"
      id={id}
      className="hidden"
      accept={accept}
      onChange={onChange}
    />
  </div>
);

export default function InstructorRegister() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState({
    otp: false,
    submit: false
  });

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
    onSubmit: async (values) => {
      if (!otpVerified) {
        toast.warning("Please verify your email first");
        return;
      }

      setLoading({ ...loading, submit: true });

      const formData = new FormData();
      
      // Append all fields
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      try {
        const response = await axios.post(
          'http://localhost:5000/api/instructor/auth/register',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        toast.success(response.data.message);
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading({ ...loading, submit: false });
      }
    }
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    formik.setFieldValue(field, file);
    
    // Generate preview for avatar
    if (field === 'avatar') {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
    }
  };

  const handleSendOtp = async () => {
    if (!formik.values.email) {
      toast.warning("Please enter your email first");
      return;
    }
    
    if (formik.errors.email) {
      toast.warning("Please enter a valid email address");
      return;
    }

    setLoading({ ...loading, otp: true });
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/auth/otpSent',
        { 
          email: formik.values.email, 
          role: "instructor" 
        }
      );
      
      toast.success(response.data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading({ ...loading, otp: false });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP first");
      return;
    }
    
    setLoading({ ...loading, otp: true });
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/instructor/auth/emailVerify',
        {
          email: formik.values.email,
          role: "instructor",
          otp: otp
        }
      );
      
      toast.success(response.data.message);
      setOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading({ ...loading, otp: false });
    }
  };

  // Clean up avatar preview on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
            Become an Instructor
          </h2>
          <p className="text-gray-600 mt-2">
            Join our teaching community and share your expertise
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex justify-center">
                <FileInput
                  id="avatar"
                  label="Profile Photo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                  file={formik.values.avatar}
                  type="avatar"
                />
              </div>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                )}

                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSent || loading.otp}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading.otp ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      otpSent ? "OTP Sent" : "Get OTP"
                    )}
                  </button>

                  {otpSent && (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={otpVerified}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerified || loading.otp}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading.otp ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                  )}
                </div>

                {otpVerified && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ Email verified successfully
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Create Password *
                </label>
                <input
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio *
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us about your teaching experience..."
                />
                {formik.touched.bio && formik.errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.bio}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills *
                </label>
                <input
                  name="skills"
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mathematics, Physics, Programming"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate skills with commas
                </p>
                {formik.touched.skills && formik.errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.skills}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  name="linkedInProfile"
                  value={formik.values.linkedInProfile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {formik.touched.linkedInProfile && formik.errors.linkedInProfile && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.linkedInProfile}</p>
                )}
              </div>
            </div>

            {/* Right Column - Documents */}
            <div className="space-y-5">
              <FileInput
                id="demoVideo"
                label="Demo Teaching Video"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'demoVideo')}
                file={formik.values.demoVideo}
              />
              {formik.touched.demoVideo && formik.errors.demoVideo && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.demoVideo}</p>
              )}

              <FileInput
                id="experienceLetter"
                label="Experience Letter"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange(e, 'experienceLetter')}
                file={formik.values.experienceLetter}
              />
              {formik.touched.experienceLetter && formik.errors.experienceLetter && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.experienceLetter}</p>
              )}

              <FileInput
                id="degreeCertificate"
                label="Degree Certificate"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange(e, 'degreeCertificate')}
                file={formik.values.degreeCertificate}
              />
              {formik.touched.degreeCertificate && formik.errors.degreeCertificate && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.degreeCertificate}</p>
              )}

              <FileInput
                id="certification"
                label="Teaching Certification"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange(e, 'certification')}
                file={formik.values.certification}
              />
              {formik.touched.certification && formik.errors.certification && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.certification}</p>
              )}

              <FileInput
                id="idProof"
                label="Government ID"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange(e, 'idProof')}
                file={formik.values.idProof}
              />
              {formik.touched.idProof && formik.errors.idProof && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.idProof}</p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start mt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-indigo-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading.submit || !otpVerified}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading.submit ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
            <p className="text-center text-gray-600 text-sm mt-3">
              Our team will review your application within 24hr
            </p>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}