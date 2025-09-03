import React, { useState } from "react";
import { FaCloudUploadAlt, FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";
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

  const savedDraft = JSON.parse(localStorage.getItem("courseDraft"));
  const initialValues =
    savedDraft || {
      title: "",
      category: "",
      description: "",
      thumbnail: null,
      curriculum: [
        {
          section: "Introduction",
          lectures: [{ title: "Course Overview", file: null, duration: null }],
        },
      ],
    };

   const uploadThumbnail = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axios.post(
            "http://localhost:5000/api/instructor/course/thumbnailUploading",
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
            const res = await axios.post("http://localhost:5000/api/instructor/course/videoUploading", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setUploadProgress(prev => ({ ...prev, [key]: percent }));
                }
            });

            const url = res.data.videoUrl;
            const duration = await getVideoDuration(file);

            setFieldValue(path, url);
            setFieldValue(path.replace("file", "duration"), duration);
            setUploadStatus(prev => ({ ...prev, [key]: "success" }));
        } catch {
            setUploadStatus(prev => ({ ...prev, [key]: "error" }));
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = { ...values };

            if (typeof payload.thumbnail !== "string") {
                payload.thumbnail = await uploadThumbnail(payload.thumbnail);
            }

            await axios.post("http://localhost:5000/api/instructor/course/courseCreate", {payload}, {
                withCredentials: true,
            });

            localStorage.removeItem("courseDraft");
            toast.success("course uploaded succefully")
        } catch (error) {
            console.error("Error uploading course");
            toast.error("course uploading unsuccefully")
        }
    };

    const handleSaveDraft = (values) => {
        localStorage.setItem("courseDraft", JSON.stringify(values));
        toast.success("saved draft")
    };


  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl px-10 py-10 mb-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create New Course</h2>
              <p className="text-slate-400 mt-1 text-base">Design your learning product for thousands of students.</p>
            </div>
            <div>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">Draft auto-save</span>
            </div>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-12">
                <div className="group relative flex items-center gap-8 bg-slate-50 p-6 rounded-lg border border-dashed border-emerald-200 hover:border-emerald-400 transition mb-8 shadow-inner">
                  <div className="h-36 w-64 flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-tr from-emerald-50 to-white rounded-lg border border-emerald-100 overflow-hidden">
                    {typeof values.thumbnail === "string" ? (
                      <img src={values.thumbnail} alt="Thumbnail" className="object-cover w-full h-full" />
                    ) : (
                      <FaCloudUploadAlt className="text-5xl text-emerald-400" />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label htmlFor="thumbnail" className="font-semibold text-lg text-emerald-900 cursor-pointer group-hover:underline">
                      {typeof values.thumbnail === "string" ? "✅ Thumbnail Uploaded" : "Upload Course Thumbnail"}
                    </label>
                    <p className="text-slate-400 text-xs mt-2">Recommended: 1280x720px, .jpg/.png (max 5MB)</p>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file || file.size > 5 * 1024 * 1024) {
                          alert("Max thumbnail size is 5MB");
                          return;
                        }
                        setThumbnailUploadProgress(0);
                        const imageUrl = await uploadThumbnail(file);
                        setFieldValue("thumbnail", imageUrl);
                      }}
                    />
                    {thumbnailUploadProgress > 0 && thumbnailUploadProgress < 100 && (
                      <div className="w-full mt-3 bg-emerald-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-emerald-600 transition-all"
                          style={{ width: `${thumbnailUploadProgress}%` }}
                        />
                      </div>
                    )}
                    <ErrorMessage name="thumbnail" component="div" className="text-red-600 text-xs mt-2" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Field
                      name="title"
                      placeholder="Course Title"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-600 text-xs mt-1" />
                    <p className="text-slate-400 text-xs">{values.title.length}/100 characters</p>
                  </div>
                  <div>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Select Category</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-red-600 text-xs mt-1" />
                  </div>
                </div>
                
                <div>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Course Description – what will students learn?"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-600 text-xs mt-1" />
                  <div className="flex justify-end text-slate-400 text-xs">{values.description.length}/5000 characters</div>
                </div>

                <FieldArray name="curriculum">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-emerald-700 font-semibold text-lg">Curriculum</span>
                        <span className="ml-2 bg-slate-200 rounded-md px-2 text-xs font-semibold">{values.curriculum.length} sections</span>
                        <button
                          onClick={() =>
                            push({
                              section: `Section ${values.curriculum.length + 1}`,
                              lectures: [],
                            })
                          }
                          type="button"
                          className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold ml-4 text-sm"
                          aria-label="Add section"
                        >
                          <FaPlus /> Add Section
                        </button>
                      </div>
                      {values.curriculum.map((section, sectionIndex) => (
                        <div
                          key={sectionIndex}
                          className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-md"
                        >
                          <div className="flex items-center mb-2">
                            <Field
                              name={`curriculum.${sectionIndex}.section`}
                              placeholder="Section title"
                              className="font-bold text-lg border-b border-emerald-200 flex-grow px-0 pb-1 bg-transparent focus:ring-0 focus:outline-none"
                            />
                            {values.curriculum.length > 1 && (
                              <button
                                type="button"
                                aria-label={`Remove section ${sectionIndex}`}
                                onClick={() => remove(sectionIndex)}
                                className="ml-4 text-red-500 hover:bg-red-100 rounded-full p-2"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                          <ErrorMessage
                            name={`curriculum.${sectionIndex}.section`}
                            component="div"
                            className="text-red-600 text-xs mb-2"
                          />

                          <FieldArray name={`curriculum.${sectionIndex}.lectures`}>
                            {({ push: pushLecture, remove: removeLecture }) => (
                              <div>
                                {section.lectures.map((lecture, lectureIndex) => {
                                  const key = `${sectionIndex}-${lectureIndex}`;
                                  const filePath = `curriculum.${sectionIndex}.lectures.${lectureIndex}.file`;
                                  const durationPath = `curriculum.${sectionIndex}.lectures.${lectureIndex}.duration`;
                                  return (
                                    <div
                                      key={lectureIndex}
                                      className="mb-5 py-4 px-4 rounded-md bg-white border border-slate-200 shadow-inner flex flex-col md:flex-row md:items-center gap-4 relative group"
                                    >
                                      <Field
                                        name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                        placeholder="Lecture Title"
                                        className="w-full md:w-2/5 px-3 py-2 border border-slate-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                      />
                                      <ErrorMessage
                                        name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                        component="div"
                                        className="text-red-600 text-xs absolute left-0 -bottom-5"
                                      />
                                      <div className="w-full md:w-[320px] flex items-center">
                                        {typeof lecture.file === "string" ? (
                                          <div className="flex items-center gap-2 text-green-700 font-bold text-xs">
                                            <FaCheckCircle className="mr-1" />
                                            Uploaded
                                            <a
                                              href={lecture.file}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="ml-2 underline text-emerald-500"
                                            >
                                              View
                                            </a>
                                          </div>
                                        ) : (
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-700"
                                            onChange={(e) => {
                                              const file = e.target.files[0];
                                              if (!file || file.size > 100 * 1024 * 1024) {
                                                alert("Max video size is 100MB");
                                                return;
                                              }
                                              setUploadStatus((prev) => ({
                                                ...prev,
                                                [key]: null,
                                              }));
                                              setUploadProgress((prev) => ({
                                                ...prev,
                                                [key]: 0,
                                              }));
                                              handleVideoUpload(file, key, setFieldValue, filePath);
                                            }}
                                            aria-label={`Upload video for lecture ${lectureIndex + 1}`}
                                          />
                                        )}
                                        {uploadStatus[key] === "uploading" && (
                                          <div className="ml-2 w-20 h-2 rounded-full bg-emerald-100">
                                            <div
                                              className="h-2 bg-emerald-500 rounded-full"
                                              style={{ width: `${uploadProgress[key] || 0}%` }}
                                            />
                                          </div>
                                        )}
                                        {uploadStatus[key] === "success" && (
                                          <span className="ml-2 text-green-700 font-semibold">Done</span>
                                        )}
                                        {uploadStatus[key] === "error" && (
                                          <span className="ml-2 text-red-600 font-semibold">Failed</span>
                                        )}
                                      </div>
                                      <ErrorMessage
                                        name={filePath}
                                        component="div"
                                        className="text-red-600 text-xs absolute left-1 mt-1"
                                      />
                                      {lecture.duration && (
                                        <div className="text-xs text-slate-500 italic w-28">
                                          <span>⏱ {Math.floor(lecture.duration / 60)}m {Math.round(lecture.duration % 60)}s</span>
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeLecture(lectureIndex)}
                                        className="md:absolute md:top-2 md:right-2 text-slate-300 hover:text-red-600 bg-slate-100 p-2 rounded-full"
                                        aria-label={`Remove lecture ${lectureIndex}`}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() =>
                                    pushLecture({ title: "", file: null, duration: null })
                                  }
                                  className="text-emerald-700 text-sm flex items-center gap-1 font-semibold hover:underline ml-1"
                                  aria-label={`Add lecture to section ${section.section}`}
                                >
                                  <FaPlus /> Add Lecture
                                </button>
                              </div>
                            )}
                          </FieldArray>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <div className="flex items-center justify-between border-t pt-8 mt-12">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleSaveDraft(values)}
                      className="bg-white border border-emerald-300 text-emerald-700 font-bold py-2 px-8 rounded-xl shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white font-semibold py-2 px-8 rounded-xl shadow-xl hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      Submit Course
                    </button>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">
                      All videos saved as URLs and durations. No need to re-upload unless changed.
                    </span>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default CreateCourse;
