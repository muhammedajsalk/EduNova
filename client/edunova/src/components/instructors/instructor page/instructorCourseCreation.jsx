import React, { useState } from "react";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Topbar from "../instructor layout/topbar";
import axios from 'axios'

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").max(100),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required").max(5000),

    // Thumbnail max 5MB
    thumbnail: Yup.mixed()
        .required("Thumbnail is required")
        .test("fileSize", "Thumbnail must be less than 5MB", (value) => {
            return value && value.size <= 5 * 1024 * 1024; // 5MB
        }),

    curriculum: Yup.array().of(
        Yup.object().shape({
            section: Yup.string().required("Section name is required"),
            lectures: Yup.array().of(
                Yup.object().shape({
                    title: Yup.string().required("Lecture title is required"),

                    // Video max 100MB
                    file: Yup.mixed()
                        .required("Lecture file is required")
                        .test("fileSize", "Lecture video must be less than 100MB", (value) => {
                            return value && value.size <= 100 * 1024 * 1024; // 100MB
                        }),
                })
            ),
        })
    ),
});


const CreateCourse = () => {

    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState({});

    const savedDraft = JSON.parse(localStorage.getItem("courseDraft"));

    const initialValues = savedDraft || {
        title: "",
        category: "",
        description: "",
        thumbnail: null,
        curriculum: [
            {
                section: "Introduction",
                lectures: [
                    {
                        title: "Course Overview",
                        file: null,
                    },
                ],
            },
        ],
    };

    const handleSubmit = (values) => {
        console.log("Course submitted:", values);
    };

    const handleSaveDraft = (values) => {
        localStorage.setItem("courseDraft", JSON.stringify(values));
        alert("Draft saved!");
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
                                {/* Thumbnail Upload */}
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 mb-6">
                                    <label
                                        htmlFor="thumbnail"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <FaCloudUploadAlt className="text-3xl mb-2" />
                                        <span>
                                            {values.thumbnail
                                                ? values.thumbnail.name
                                                : "Upload course thumbnail"}
                                        </span>
                                        <span className="text-xs">(Recommended size: 1280×720px)</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="thumbnail"
                                        className="hidden"
                                        onChange={(e) =>
                                            setFieldValue("thumbnail", e.currentTarget.files[0])
                                        }
                                    />
                                    <ErrorMessage
                                        name="thumbnail"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <Field
                                        name="title"
                                        placeholder="Enter a compelling course title"
                                        maxLength={100}
                                        className="w-full border border-gray-300 rounded p-2"
                                    />
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {values.title.length}/100 characters
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <Field
                                        as="select"
                                        name="category"
                                        className="w-full border border-gray-300 rounded p-2"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="development">Development</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                    </Field>
                                    <ErrorMessage
                                        name="category"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <Field
                                        as="textarea"
                                        name="description"
                                        placeholder="Describe what students will learn"
                                        maxLength={5000}
                                        rows={5}
                                        className="w-full border border-gray-300 rounded p-2"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {values.description.length}/5000 characters
                                    </p>
                                </div>

                                {console.log(values)}

                                {/* Curriculum */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Course Curriculum</h3>
                                    <FieldArray name="curriculum">
                                        {({ push, remove }) => (
                                            <>
                                                {values.curriculum.map((section, sectionIndex) => (
                                                    <div
                                                        key={sectionIndex}
                                                        className="border border-gray-200 rounded mb-4 bg-gray-50 p-4"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <Field
                                                                name={`curriculum.${sectionIndex}.section`}
                                                                placeholder="Section Title"
                                                                className="w-full font-semibold text-lg border-b border-gray-300 outline-none bg-transparent"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(sectionIndex)}
                                                                className="ml-4 text-red-600 text-sm hover:underline px-2 py-1 rounded bg-red-200 hover:bg-red-400 transition"
                                                            >
                                                                Delete Section
                                                            </button>
                                                        </div>
                                                        <ErrorMessage
                                                            name={`curriculum.${sectionIndex}.section`}
                                                            component="div"
                                                            className="text-red-500 text-sm"
                                                        />

                                                        <FieldArray name={`curriculum.${sectionIndex}.lectures`}>
                                                            {({ push: pushLecture, remove: removeLecture }) => (
                                                                <>
                                                                    {section.lectures.map((lecture, lectureIndex) => (
                                                                        <div
                                                                            key={lectureIndex}
                                                                            className="mb-4 border rounded p-3 bg-white relative"
                                                                        >
                                                                            <Field
                                                                                name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                                                                placeholder="Lecture Title"
                                                                                className="w-full mb-2 border p-2 rounded"
                                                                            />
                                                                            <ErrorMessage
                                                                                name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.title`}
                                                                                component="div"
                                                                                className="text-red-500 text-sm"
                                                                            />

                                                                            <input  
                                                                                type="file"
                                                                                className="w-full mb-2 border rounded p-2 cursor-pointer text-sm"
                                                                                onChange={async (e) => {
                                                                                    const file = e.currentTarget.files[0];

                                                                                    // Save upload progress per lecture using sectionIndex + lectureIndex as key
                                                                                    const key = `${sectionIndex}-${lectureIndex}`;
                                                                                    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));

                                                                                    const formData = new FormData();
                                                                                    formData.append("video", file);

                                                                                    try {
                                                                                        const res = await axios.post("http://localhost:5000/api/instructor/course/videoUploading", formData, {
                                                                                            withCredentials:true,
                                                                                            headers: { "Content-Type": "multipart/form-data"},
                                                                                            onUploadProgress: (progressEvent) => {
                                                                                                const percent = Math.round(
                                                                                                    (progressEvent.loaded * 100) / progressEvent.total
                                                                                                );
                                                                                                setUploadProgress((prev) => ({ ...prev, [key]: percent }));
                                                                                            },
                                                                                        });

                                                                                        // Set the video URL in Formik after successful upload
                                                                                        setFieldValue(
                                                                                            `curriculum.${sectionIndex}.lectures.${lectureIndex}.file`,
                                                                                            res.data.videoUrl // assuming backend returns { videoUrl: '...' }
                                                                                        );

                                                                                        setUploadStatus((prev) => ({ ...prev, [key]: "success" }));
                                                                                    } catch (error) {
                                                                                        setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            {uploadStatus[`${sectionIndex}-${lectureIndex}`] === "uploading" && (
                                                                                <div className="text-blue-500 text-sm">
                                                                                    Uploading... {uploadProgress[`${sectionIndex}-${lectureIndex}`] || 0}%
                                                                                </div>
                                                                            )}

                                                                            {uploadStatus[`${sectionIndex}-${lectureIndex}`] === "success" && (
                                                                                <div className="text-green-600 text-sm">✅ Uploaded</div>
                                                                            )}
                                                                            
            

                                                                            {uploadStatus[`${sectionIndex}-${lectureIndex}`] === "error" && (
                                                                                <div className="text-red-600 text-sm">❌ Upload failed. Please try again.</div>
                                                                            )}



                                                                            <ErrorMessage
                                                                                name={`curriculum.${sectionIndex}.lectures.${lectureIndex}.file`}
                                                                                component="div"
                                                                                className="text-red-500 text-sm"
                                                                            />

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeLecture(lectureIndex)}
                                                                                className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded hover:bg-red-200 transition"
                                                                            >
                                                                                Delete
                                                                            </button>

                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            pushLecture({
                                                                                title: "",
                                                                                file: null,
                                                                            })
                                                                        }
                                                                        className="text-indigo-600 text-sm mt-2 flex items-center gap-1 hover:underline"
                                                                    >
                                                                        <FaPlus /> Add Lecture
                                                                    </button>
                                                                </>
                                                            )}
                                                        </FieldArray>
                                                    </div>
                                                ))}


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        push({
                                                            section: `New Section ${values.curriculum.length + 1}`,
                                                            lectures: [],
                                                        })
                                                    }
                                                    className="text-indigo-600 text-sm mt-4 flex items-center hover:underline"
                                                >
                                                    <FaPlus /> Add Section
                                                </button>
                                            </>
                                        )}
                                    </FieldArray>
                                </div>


                                <button
                                    type="button"
                                    onClick={() => handleSaveDraft(values)}
                                    className="mt-6 bg-indigo-600 text-white py-2 mr-2 px-4 rounded hover:bg-indigo-700"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="submit"
                                    className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                                >
                                    Submit Course
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <p className="text-red-500 text-sm mt-2">
                        Note: Uploaded files will not be saved in drafts. Please re-upload them when resuming.
                    </p>

                </div>
            </div>
        </>
    );
};

export default CreateCourse;
