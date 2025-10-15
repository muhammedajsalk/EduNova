import React, { useState } from "react";
import { 
  FaCloudUploadAlt, 
  FaPlus, 
  FaTrash, 
  FaCheckCircle, 
  FaVideo, 
  FaImage,
  FaBookOpen,
  FaLayerGroup,
  FaGripVertical,
  FaSave,
  FaRocket,
  FaInfoCircle,
  FaClock,
  FaEdit
} from "react-icons/fa";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject("Failed to read duration");
    video.src = URL.createObjectURL(file);
  });
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").max(100),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required").max(5000),
  thumbnail: Yup.mixed()
    .required("Thumbnail required")
    .test("fileSize", "Max 5MB", (val) =>
      typeof val === "string" || (val && val.size <= 5 * 1024 * 1024)
    ),
  curriculum: Yup.array().of(
    Yup.object({
      section: Yup.string().required("Section title required"),
      lectures: Yup.array().of(
        Yup.object({
          title: Yup.string().required("Lecture title required"),
          file: Yup.mixed()
            .required("Video required")
            .test("fileSize", "Max 100MB", (val) =>
              typeof val === "string" || (val && val.size <= 100 * 1024 * 1024)
            ),
          duration: Yup.number().nullable(),
        })
      ),
    })
  ),
});

const CreateCourse = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const savedDraft = JSON.parse(localStorage.getItem("courseDraft"));
  const initialValues = savedDraft || {
    title: "",
    category: "",
    description: "",
    thumbnail: null,
    curriculum: [
      {
        section: "Introduction",
        lectures: [{ title: "Welcome to the Course", file: null, duration: null }],
      },
    ],
  };

  const categories = [
    { value: "development", label: "💻 Development", icon: "💻" },
    { value: "design", label: "🎨 Design", icon: "🎨" },
    { value: "marketing", label: "📈 Marketing", icon: "📈" },
    { value: "business", label: "💼 Business", icon: "💼" },
    { value: "photography", label: "📸 Photography", icon: "📸" },
    { value: "music", label: "🎵 Music", icon: "🎵" },
  ];

  const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/instructor/course/thumbnailUploading`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setThumbnailUploadProgress(percent);
        },
      }
    );

    setThumbnailUploadProgress(0);
    return res.data.imageUrl;
  };

  const handleVideoUpload = async (file, key, setFieldValue, path) => {
    const formData = new FormData();
    formData.append("video", file);
    setUploadStatus(prev => ({ ...prev, [key]: "uploading" }));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/instructor/course/videoUploading`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(prev => ({ ...prev, [key]: percent }));
          }
        }
      );

      const url = res.data.videoUrl;
      const duration = await getVideoDuration(file);

      setFieldValue(path, url);
      setFieldValue(path.replace("file", "duration"), duration);
      setUploadStatus(prev => ({ ...prev, [key]: "success" }));
      toast.success("Video uploaded successfully!");
    } catch {
      setUploadStatus(prev => ({ ...prev, [key]: "error" }));
      toast.error("Video upload failed!");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values };

      if (typeof payload.thumbnail !== "string") {
        payload.thumbnail = await uploadThumbnail(payload.thumbnail);
      }

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/instructor/course/courseCreate`,
        { payload },
        { withCredentials: true }
      );

      localStorage.removeItem("courseDraft");
      toast.success("Course created successfully! 🎉");
    } catch (error) {
      toast.error("Failed to create course");
    }
  };

  const handleSaveDraft = (values) => {
    localStorage.setItem("courseDraft", JSON.stringify(values));
    toast.success("Draft saved successfully!");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/90">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <FaBookOpen className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                  <p className="text-sm text-gray-500">Build your next amazing learning experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Auto-saving
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Course Creation Progress</h3>
                    <span className="text-sm text-gray-500">
                      {Math.round(
                        ((values.title ? 25 : 0) +
                        (values.category ? 25 : 0) +
                        (values.description ? 25 : 0) +
                        (values.thumbnail ? 25 : 0)) / 100 * 100
                      )}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${
                          ((values.title ? 25 : 0) +
                          (values.category ? 25 : 0) +
                          (values.description ? 25 : 0) +
                          (values.thumbnail ? 25 : 0))}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <FaInfoCircle /> Course Information
                    </h2>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Course Thumbnail
                      </label>
                      <div className="flex items-center gap-8">
                        <div 
                          className="relative w-80 h-44 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-dashed border-emerald-300 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all group"
                          onClick={() => document.getElementById('thumbnail').click()}
                        >
                          {typeof values.thumbnail === "string" ? (
                            <>
                              <img 
                                src={values.thumbnail} 
                                alt="Thumbnail" 
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaEdit className="text-white text-3xl" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <FaImage className="text-5xl text-emerald-400 mb-3" />
                              <p className="text-sm font-medium text-gray-600">Click to upload thumbnail</p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                            </div>
                          )}
                          
                          {thumbnailUploadProgress > 0 && thumbnailUploadProgress < 100 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                style={{ width: `${thumbnailUploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <h4 className="font-semibold text-emerald-900 mb-2">
                              📸 Thumbnail Guidelines
                            </h4>
                            <ul className="text-sm text-emerald-700 space-y-1">
                              <li>• Use high-quality images (1280x720px recommended)</li>
                              <li>• Include course title in the image</li>
                              <li>• Use contrasting colors for better visibility</li>
                              <li>• Keep it simple and professional</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file || file.size > 5 * 1024 * 1024) {
                            toast.error("Maximum thumbnail size is 5MB");
                            return;
                          }
                          const imageUrl = await uploadThumbnail(file);
                          setFieldValue("thumbnail", imageUrl);
                        }}
                      />
                      <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-2" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Course Title
                        </label>
                        <div className="relative">
                          <Field
                            name="title"
                            placeholder="e.g., Complete Web Development Bootcamp"
                            className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                              errors.title && touched.title ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                          <div className="absolute right-3 top-3 text-xs text-gray-400">
                            {values.title.length}/100
                          </div>
                        </div>
                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white ${
                            errors.category && touched.category ? 'border-red-300' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={5}
                        placeholder="Describe what students will learn, prerequisites, and course outcomes..."
                        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none ${
                          errors.description && touched.description ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                        <span className="text-xs text-gray-400">
                          {values.description.length}/5000 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <FaLayerGroup /> Course Curriculum
                      </h2>
                      <div className="flex items-center gap-4 text-white/90">
                        <span className="text-sm">
                          {values.curriculum.length} sections
                        </span>
                        <span className="text-sm">
                          {values.curriculum.reduce((acc, section) => acc + section.lectures.length, 0)} lectures
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <FieldArray name="curriculum">
                      {({ push, remove }) => (
                        <>
                          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {values.curriculum.map((section, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setActiveSection(index)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                                  activeSection === index
                                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {section.section || `Section ${index + 1}`}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                push({
                                  section: `Section ${values.curriculum.length + 1}`,
                                  lectures: [],
                                });
                                setActiveSection(values.curriculum.length);
                              }}
                              className="px-4 py-2 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                              <FaPlus /> Add Section
                            </button>
                          </div>

                          {values.curriculum[activeSection] && (
                            <div className="bg-gray-50 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex-1 mr-4">
                                  <Field
                                    name={`curriculum.${activeSection}.section`}
                                    placeholder="Section title"
                                    className="text-xl font-bold bg-transparent border-b-2 border-emerald-300 focus:border-emerald-500 outline-none py-2 w-full"
                                  />
                                  <ErrorMessage
                                    name={`curriculum.${activeSection}.section`}
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                                {values.curriculum.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      remove(activeSection);
                                      setActiveSection(Math.max(0, activeSection - 1));
                                    }}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>

                              <FieldArray name={`curriculum.${activeSection}.lectures`}>
                                {({ push: pushLecture, remove: removeLecture }) => (
                                  <div className="space-y-4">
                                    {values.curriculum[activeSection].lectures.map((lecture, lectureIndex) => {
                                      const key = `${activeSection}-${lectureIndex}`;
                                      const filePath = `curriculum.${activeSection}.lectures.${lectureIndex}.file`;
                                      
                                      return (
                                        <div
                                          key={lectureIndex}
                                          className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all group"
                                        >
                                          <div className="flex items-start gap-4">
                                            <div className="pt-2">
                                              <FaGripVertical className="text-gray-400" />
                                            </div>
                                            
                                            <div className="flex-1 space-y-4">
                                              <div className="flex items-center gap-4">
                                                <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                                                  {lectureIndex + 1}
                                                </span>
                                                <Field
                                                  name={`curriculum.${activeSection}.lectures.${lectureIndex}.title`}
                                                  placeholder="Lecture title"
                                                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                              </div>

                                              <div className="flex items-center gap-4">
                                                {typeof lecture.file === "string" ? (
                                                  <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                      <FaCheckCircle className="text-emerald-600" />
                                                      <span className="font-medium text-emerald-700">
                                                        Video uploaded
                                                      </span>
                                                      {lecture.duration && (
                                                        <span className="text-sm text-emerald-600">
                                                          <FaClock className="inline mr-1" />
                                                          {formatDuration(lecture.duration)}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <a
                                                      href={lecture.file}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                                    >
                                                      Preview →
                                                    </a>
                                                  </div>
                                                ) : (
                                                  <div className="flex-1">
                                                    <label className="flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                                                      <FaVideo className="text-gray-400" />
                                                      <span className="text-gray-600">Choose video file</span>
                                                      <input
                                                        type="file"
                                                        accept="video/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                          const file = e.target.files[0];
                                                          if (!file || file.size > 100 * 1024 * 1024) {
                                                            toast.error("Maximum video size is 100MB");
                                                            return;
                                                          }
                                                          handleVideoUpload(file, key, setFieldValue, filePath);
                                                        }}
                                                      />
                                                    </label>
                                                  </div>
                                                )}
                                                
                                                <button
                                                  type="button"
                                                  onClick={() => removeLecture(lectureIndex)}
                                                  className="text-gray-400 hover:text-red-500 p-2"
                                                >
                                                  <FaTrash />
                                                </button>
                                              </div>

                                              {uploadStatus[key] === "uploading" && (
                                                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                                                  <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                                    style={{ width: `${uploadProgress[key] || 0}%` }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    
                                    <button
                                      type="button"
                                      onClick={() => pushLecture({ title: "", file: null, duration: null })}
                                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 font-medium"
                                    >
                                      <FaPlus /> Add Lecture
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          )}
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <FaInfoCircle className="inline mr-2" />
                      Your course will be reviewed before publishing
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleSaveDraft(values)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <FaSave /> Save Draft
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <FaRocket /> Publish Course
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default React.memo(CreateCourse);