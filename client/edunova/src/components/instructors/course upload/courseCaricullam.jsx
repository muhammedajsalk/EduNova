import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import InstructorNavbar from '../instructorNavbar';

// 🔧 Section template
const createSection = (title = '') => ({
    title: title || 'Untitled Section',
    tempTitle: '',
    editingTitle: false,
    showAddForm: false,
    newLecture: '',
    lectures: [],
});

const CourseCurriculum = () => {
    const [sections, setSections] = useState([
        createSection('Introduction'),
        createSection('Getting Started'),
    ]);

    // 🔄 Update section state
    const updateSection = (index, changes) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], ...changes };
        setSections(updated);
    };

    // ✏️ Rename
    const toggleRename = (i) =>
        updateSection(i, {
            editingTitle: !sections[i].editingTitle,
            tempTitle: sections[i].title,
        });

    const saveTitle = (i) => {
        const title = sections[i].tempTitle.trim();
        if (title) {
            updateSection(i, { title, editingTitle: false, tempTitle: '' });
        }
    };

    // ➕ Lecture
    const saveLecture = (i) => {
        const name = sections[i].newLecture.trim();
        if (name) {
            const updated = [...sections];
            updated[i].lectures.push(name);
            updated[i].newLecture = '';
            updated[i].showAddForm = false;
            setSections(updated);
        }
    };

    // 🗑️ Delete
    const deleteLecture = (i, j) => {
        const updated = [...sections];
        updated[i].lectures.splice(j, 1);
        setSections(updated);
    };

    const deleteSection = (i) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            const updated = [...sections];
            updated.splice(i, 1);
            setSections(updated);
        }
    };

    // ➕ Section
    const addSection = () =>
        setSections([...sections, createSection(`New Section ${sections.length + 1}`)]);

    return (
        <>
        <InstructorNavbar/>
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col mt-12 md:flex-row gap-6">
            {/* Left Side */}
            <div className="flex-1 w-full">
                <h2 className="text-2xl font-semibold mb-1">Course Curriculum</h2>
                <p className="text-gray-500 mb-6">Create your course content and structure</p>

                {sections.map((section, i) => (
                    <div key={i} className="mb-4 shadow-sm rounded-lg p-4 bg-white shadow-sm">
                        <details open>
                            <summary className="flex justify-between items-center text-lg font-semibold cursor-pointer">
                                {section.editingTitle ? (
                                    <div className="flex gap-2 w-full">
                                        <input
                                            value={section.tempTitle}
                                            onChange={(e) => updateSection(i, { tempTitle: e.target.value })}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                        <button className="text-indigo-600 text-sm" onClick={() => saveTitle(i)}>
                                            Save
                                        </button>
                                        <button className="text-gray-600 text-sm" onClick={() => toggleRename(i)}>
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between w-full items-center">
                                        <span>📁 {section.title}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-sm text-gray-500 hover:underline"
                                                onClick={() => toggleRename(i)}
                                            >
                                                ✏️ Rename
                                            </button>
                                            <button
                                                className="text-sm text-red-500 hover:underline"
                                                onClick={() => deleteSection(i)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </summary>

                            {/* Lectures */}
                            <ul className="ml-6 mt-3 space-y-2">
                                {section.lectures.map((lecture, j) => (
                                    <li
                                        key={j}
                                        className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                    >
                                        <span>• {lecture}</span>
                                        <button
                                            className="text-red-500 text-sm hover:underline"
                                            onClick={() => deleteLecture(i, j)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </details>

                        {/* Add Lecture Form */}
                        {section.showAddForm ? (
                            <div className="mt-4 bg-gray-50 border border-gray-300 p-4 rounded">
                                <label className="block text-sm mb-1 font-medium">Lecture Title</label>
                                <input
                                    value={section.newLecture}
                                    onChange={(e) => updateSection(i, { newLecture: e.target.value })}
                                    placeholder="Enter lecture name"
                                    className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                />

                                <label className="block text-sm mb-1 font-medium">Upload File</label>
                                <input type="file" className="w-full mb-3" />

                                <div className="flex gap-2">
                                    <button
                                        className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                                        onClick={() => saveLecture(i)}
                                    >
                                        Save Lecture
                                    </button>
                                    <button
                                        className="text-gray-500 text-sm"
                                        onClick={() => updateSection(i, { showAddForm: false })}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="text-indigo-600 text-sm mt-2"
                                onClick={() => updateSection(i, { showAddForm: true })}
                            >
                                + Add Lecture
                            </button>
                        )}
                    </div>
                ))}

                {/* Add New Section */}
                <div
                    className="w-full mt-4 border-dashed border-2 border-gray-300 text-center py-4 rounded cursor-pointer text-indigo-600 hover:bg-gray-100"
                    onClick={addSection}
                >
                    + Add New Section
                </div>
            </div>

            {/* Right Side - Stats */}
            <div className="w-full md:w-1/3 bg-white p-6 rounded shadow-sm h-fit">
                <h3 className="text-lg font-semibold mb-4">Curriculum Stats</h3>
                <ul className="text-gray-700 space-y-3 text-sm">
                    <li>
                        ⏱ <strong>Total Duration:</strong> 2h 30m
                    </li>
                    <li>
                        🎓 <strong>Lectures:</strong>{' '}
                        {sections.reduce((total, sec) => total + sec.lectures.length, 0)}
                    </li>
                    <li>
                        📂 <strong>Sections:</strong> {sections.length}
                    </li>
                </ul>
            </div>

            {/* Bottom Buttons */}
            <div className="w-full flex justify-end items-center mt-6 md:absolute bottom-6 right-6">
                <button className="border border-gray-300 px-4 py-2 mr-3 rounded">Preview</button>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                    <Link to={'/instructor/Course_Upload/course_preview'}>
                        Next: Preview
                    </Link>
                </button>
            </div>
        </div>
        </>
        
    );
};

export default CourseCurriculum;
