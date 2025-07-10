import React, { useState } from "react";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Topbar from "../instructor layout/topbar";
import { toast ,ToastContainer} from "react-toastify";

// ✅ Get duration from video file
const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration); // duration in seconds
        };
        video.onerror = () => reject("Failed to read duration");
        video.src = URL.createObjectURL(file);
    });
};

// ✅ Yup validation schema
const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(100),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required").max(5000),
    thumbnail: Yup.mixed().required("Thumbnail required").test("fileSize", "Max 5MB", val =>
        typeof val === "string" || (val && val.size <= 5 * 1024 * 1024)
    ),
    curriculum: Yup.array().of(
        Yup.object({
            section: Yup.string().required("Section title required"),
            lectures: Yup.array().of(
                Yup.object({
                    title: Yup.string().required("Lecture title required"),
                    file: Yup.mixed().required("Video required").test("fileSize", "Max 100MB", val =>
                        typeof val === "string" || (val && val.size <= 100 * 1024 * 1024)
                    ),
                    duration: Yup.number().nullable(),
                })
            )
        })
    )
});

const CreateCourse = () => {
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState({});
    const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
    const [dataInformation,setDataInformation]=useState()


    const savedDraft = JSON.parse(localStorage.getItem("courseDraft"));
    const initialValues = savedDraft || {
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

    // ✅ Upload thumbnail
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

        setThumbnailUploadProgress(0); // reset after upload
        return res.data.imageUrl;
    };


    // ✅ Upload video & get duration
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

            console.log("payload"+payload)

            // Upload thumbnail if new
            if (typeof payload.thumbnail !== "string") {
                payload.thumbnail = await uploadThumbnail(payload.thumbnail);
            }

            await axios.post("http://localhost:5000/api/instructor/course/courseCreate", {payload}, {
                withCredentials: true,
            });

            localStorage.removeItem("courseDraft");
            toast.success("course uploaded succefully")
        } catch (error) {
            console.error(error);
            toast.error("course uploading unsuccefully")
        }
    };

    const handleSaveDraft = (values) => {
        localStorage.setItem("courseDraft", JSON.stringify(values));
        toast.success("saved draft")
    };

    return (
        <>
            <Topbar />
            <div className="min-h-screen bg-gray-50 p-4 md:p-10">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 md:p-10">
                    <h2 className="text-2xl font-semibold mb-6">Create New Course</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>
                                {/* Thumbnail */}
                                <div className="border-dashed border rounded p-6 flex flex-col items-center mb-6 text-gray-500">
                                    <label htmlFor="thumbnail" className="cursor-pointer text-center">
                                        <FaCloudUploadAlt className="text-3xl mb-2" />
                                        <span>
                                            {typeof values.thumbnail === "string"
                                                ? "✅ Thumbnail Uploaded"
                                                : "Upload course thumbnail"}
                                        </span>
                                        <p className="text-xs">(Recommended: 1280×720px)</p>
                                    </label>

                                    <input
                                        id="thumbnail"
                                        type="file"
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

                                            // Optional: Save immediately to draft
                                            const draft = { ...values, thumbnail: imageUrl };
                                        }}
                                    />

                                    {/* Uploaded preview */}
                                    {typeof values.thumbnail === "string" && (
                                        <img
                                            src={values.thumbnail}
                                            alt="Thumbnail preview"
                                            className="mt-3 w-60 rounded border"
                                        />
                                    )}

                                    {/* Progress */}
                                    {thumbnailUploadProgress > 0 && thumbnailUploadProgress < 100 && (
                                        <div className="text-sm text-indigo-600 mt-2">
                                            Uploading... {thumbnailUploadProgress}%
                                        </div>
                                    )}

                                    <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <Field name="title" placeholder="Course Title" className="w-full border rounded p-2" />
                                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                    <p className="text-sm text-gray-500">{values.title.length}/100 characters</p>
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <Field as="select" name="category" className="w-full border p-2 rounded">
                                        <option value="">Select Category</option>
                                        <option value="development">Development</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <Field as="textarea" name="description" rows={5}
                                        placeholder="What will students learn?"
                                        className="w-full border p-2 rounded" />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                    <p className="text-sm text-gray-500">{values.description.length}/5000 characters</p>
                                </div>

                                {/* Curriculum */}
                                <FieldArray name="curriculum">
                                    {({ push, remove }) => (
                                        <>
                                            {values.curriculum.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="border rounded p-4 mb-4 bg-gray-50">
                                                    <div className="flex justify-between mb-2">
                                                        <Field name={`curriculum.${sectionIndex}.section`}
                                                            placeholder="Section Title"
                                                            className="w-full font-semibold text-lg border-b bg-transparent"
                                                        />
                                                        <button type="button" onClick={() => remove(sectionIndex)}
                                                            className="ml-2 text-red-600 text-sm hover:underline">Delete</button>
                                                    </div>
                                                    <ErrorMessage name={`curriculum.${sectionIndex}.section`}
                                                        component="div" className="text-red-500 text-sm" />

                                                    <FieldArray name={`curriculum.${sectionIndex}.lectures`}>
                                                        {({ push: pushLecture, remove: removeLecture }) => (
                                                            <>
                                                                {section.lectures.map((lecture, lectureIndex) => {
                                                                    const key = `${sectionIndex}-${lectureIndex}`;
                                                                    const path = `curriculum.${sectionIndex}.lectures.${lectureIndex}.file`;
                                                                    const durationPath = `curriculum.${sectionIndex}.lectures.${lectureIndex}.duration`;

                                                                    return (
                                                                        <div key={lectureIndex} className="mb-4 border p-3 bg-white relative">
                                                                            <Field
                                                                                name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                                                                placeholder="Lecture Title"
                                                                                className="w-full mb-2 border p-2 rounded"
                                                                            />
                                                                            <ErrorMessage name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                                                                component="div" className="text-red-500 text-sm" />

                                                                            {typeof lecture.file === "string" ? (
                                                                                <div className="text-green-600 text-sm flex gap-2 items-center">
                                                                                    ✅ Uploaded –
                                                                                    <a href={lecture.file} target="_blank" rel="noreferrer"
                                                                                        className="underline text-indigo-600">View</a>
                                                                                </div>
                                                                            ) : (
                                                                                <input type="file"
                                                                                    className="w-full border p-2 rounded text-sm"
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        if (!file || file.size > 100 * 1024 * 1024) {
                                                                                            alert("Max video size is 100MB");
                                                                                            return;
                                                                                        }
                                                                                        setUploadStatus(prev => ({ ...prev, [key]: null }));
                                                                                        setUploadProgress(prev => ({ ...prev, [key]: 0 }));
                                                                                        handleVideoUpload(file, key, setFieldValue, path);
                                                                                    }}
                                                                                />
                                                                            )}

                                                                            {/* Upload Progress */}
                                                                            {uploadStatus[key] === "uploading" && (
                                                                                <div className="text-indigo-500 text-sm">Uploading... {uploadProgress[key] || 0}%</div>
                                                                            )}
                                                                            {uploadStatus[key] === "success" && (
                                                                                <div className="text-green-600 text-sm">✅ Uploaded</div>
                                                                            )}
                                                                            {uploadStatus[key] === "error" && (
                                                                                <div className="text-red-600 text-sm">❌ Upload failed</div>
                                                                            )}
                                                                            <ErrorMessage name={path} component="div" className="text-red-500 text-sm" />

                                                                            {/* Show Duration */}
                                                                            {lecture.duration && (
                                                                                <p className="text-sm text-gray-600">
                                                                                    ⏱ Duration: {Math.floor(lecture.duration / 60)}m {Math.round(lecture.duration % 60)}s
                                                                                </p>
                                                                            )}

                                                                            <button type="button" onClick={() => removeLecture(lectureIndex)}
                                                                                className="absolute top-2 right-2 text-red-600 text-xs bg-red-100 px-2 py-1 rounded">Delete</button>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <button type="button"
                                                                    onClick={() => pushLecture({ title: "", file: null, duration: null })}
                                                                    className="text-indigo-600 text-sm flex items-center gap-1 hover:underline">
                                                                    <FaPlus /> Add Lecture
                                                                </button>
                                                            </>
                                                        )}
                                                    </FieldArray>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() =>
                                                push({ section: `New Section ${values.curriculum.length + 1}`, lectures: [] })}
                                                className="text-indigo-600 text-sm flex items-center gap-1 hover:underline mt-2">
                                                <FaPlus /> Add Section
                                            </button>
                                        </>
                                    )}
                                </FieldArray>

                                {/* Action Buttons */}
                                <div className="mt-6">
                                    <button type="button" onClick={() => handleSaveDraft(values)}
                                        className="bg-indigo-600 text-white py-2 px-4 mr-2 rounded hover:bg-indigo-700">
                                        Save Draft
                                    </button>
                                    <button type="submit"
                                        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                                        Submit Course
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Note: Uploaded videos are saved as URLs and durations in seconds. No need to re-upload if draft is saved.
                                </p>
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
