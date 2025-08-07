import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useContext,
    memo,
} from "react";
import axios from "axios";
import { debounce } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../userContext";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const CourseVideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const playerRef = useRef(null);
    const lastTimeRef = useRef(null);
    const accumulatedWatchedRef = useRef(0);
    const sourceRef = useRef(axios.CancelToken.source());

    const saveWatchedTimeoutRef = useRef(null);
    const savePositionDebouncedRef = useRef(null);

    const [course, setCourse] = useState(null);
    const [videoList, setVideoList] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [secureUrl, setSecureUrl] = useState("");
    const [watchedTime, setWatchedTime] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.keyCode === 123 ||
                (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) || 
                (event.ctrlKey && event.keyCode === 85)
            ) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);


    const handleLike = () => {
        if (liked) {
            setLiked(false);
        } else {
            setLiked(true);
        }
        axios.post("http://localhost:5000/api/users/course/like",{courseId:activeVideo.courseId,lectureId:activeVideo._id},{withCredentials:true})
        .then((res)=>console.log(res.data.message))
        .catch((err)=>console.log(err))
    };


    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchCourse = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/admin/courseById/${id}`,
                    { cancelToken: sourceRef.current.token, withCredentials: true }
                );
                const courseData = response?.data?.data;
                if (!courseData) throw new Error("Course not found");

                setCourse(courseData);

                const lectures =
                    courseData.curriculum?.flatMap((section) =>
                        section.lectures.map((lecture) => ({
                            ...lecture,
                            section: section.section,
                            courseId: courseData._id,
                            courseTitle: courseData.title,
                        }))
                    ) || [];

                setVideoList(lectures);
                setActiveVideo(lectures[0] || null);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    setError("Failed to load course. Please try again.");
                    console.error("Fetch course error:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();

        return () => {
            sourceRef.current.cancel("Component unmounted");
            sourceRef.current = axios.CancelToken.source();
        };
    }, [id]);

    useEffect(() => {
        if (!activeVideo) return;

        setSecureUrl("");
        setWatchedTime(0);
        accumulatedWatchedRef.current = 0;
        lastTimeRef.current = null;
        setCompleted(false);
        setError(null);

        const fetchSecureUrl = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/course/${activeVideo.courseId}/${encodeURIComponent(
                        activeVideo.title
                    )}`,
                    { cancelToken: sourceRef.current.token, withCredentials: true }
                );
                setSecureUrl(response.data.url);

                const storedWatched = localStorage.getItem(
                    `watchedTime-${activeVideo._id}`
                );
                const watched = storedWatched ? parseFloat(storedWatched) : 0;
                accumulatedWatchedRef.current = watched;
                setWatchedTime(watched);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    setError("Failed to load video. Please try again.");
                    console.error("Fetch video URL error:", err.message);
                }
            }
        };

        fetchSecureUrl();

        return () => {
            savePositionDebouncedRef.current?.cancel();
            sourceRef.current.cancel("Video changed");
            sourceRef.current = axios.CancelToken.source();
        };
    }, [activeVideo]);

    useEffect(() => {
        saveWatchedTimeoutRef.current = debounce(() => {
            if (activeVideo) {
                localStorage.setItem(
                    `watchedTime-${activeVideo._id}`,
                    accumulatedWatchedRef.current.toString()
                );
                setWatchedTime(accumulatedWatchedRef.current);

                const updateWatchTime = async () => {
                    try {
                        await axios.post(
                            `http://localhost:5000/api/users/course/updateWatchTime`,
                            {
                                courseId: activeVideo.courseId,
                                lectureId: activeVideo._id,
                                watchTime: accumulatedWatchedRef.current,
                            },
                            { withCredentials: true }
                        );
                    } catch (err) {
                        if (!axios.isCancel(err)) {
                            console.error("Error updating watch time:", err.message);
                        }
                    }
                };
                updateWatchTime();
            }
        }, 1000);

        savePositionDebouncedRef.current = debounce(() => {
            if (activeVideo && playerRef.current) {
                const progressKey = `progress-${activeVideo._id}`;
                localStorage.setItem(
                    progressKey,
                    playerRef.current.currentTime.toString()
                );
            }
        }, 5000);

        return () => {
            saveWatchedTimeoutRef.current.cancel();
            savePositionDebouncedRef.current.cancel();
        };
    }, [activeVideo]);


    const handlePause = useCallback(() => {
        if (activeVideo && playerRef.current) {
            const progressKey = `progress-${activeVideo._id}`;
            localStorage.setItem(progressKey, playerRef.current.currentTime.toString());

            if (accumulatedWatchedRef.current > 0) {
                saveWatchedTimeoutRef.current.flush();
            }
        }
    }, [activeVideo]);

    const handleTimeUpdate = useCallback(() => {
        if (!playerRef.current) return;

        const currentTime = playerRef.current.currentTime;
        const prevTime = lastTimeRef.current;

        if (prevTime !== null) {
            const delta = currentTime - prevTime;
            if (delta > 0 && delta < 2) {
                accumulatedWatchedRef.current += delta;
                saveWatchedTimeoutRef.current(); 
                savePositionDebouncedRef.current();

                if (
                    playerRef.current.duration &&
                    currentTime / playerRef.current.duration >= 0.97 &&
                    !completed
                ) {
                    setCompleted(true);
                    saveWatchedTimeoutRef.current.flush();
                }
            }
        }

        lastTimeRef.current = currentTime;
    }, [completed, activeVideo]);

    const handleLoadedMetadata = useCallback(() => {
        lastTimeRef.current = null;
        if (!activeVideo || !playerRef.current) return;

        const progressKey = `progress-${activeVideo._id}`;
        const savedTime = localStorage.getItem(progressKey);
        if (savedTime) {
            setTimeout(() => {
                if (playerRef.current) {
                    playerRef.current.currentTime = parseFloat(savedTime);
                }
            }, 0);
        }
    }, [activeVideo]);

    useEffect(() => {
        const savePlaybackOnUnload = () => {
            if (activeVideo && playerRef.current) {
                const progressKey = `progress-${activeVideo._id}`;
                localStorage.setItem(progressKey, playerRef.current.currentTime.toString());
            }
        };
        window.addEventListener("beforeunload", savePlaybackOnUnload);
        return () => {
            savePlaybackOnUnload();
            window.removeEventListener("beforeunload", savePlaybackOnUnload);
        };
    }, [activeVideo]);

    const handleVideoError = useCallback((e) => {
        setError("Video playback failed. Please try again.");
        console.error("Playback error:", e);
    }, []);

    const getLectureProgress = useCallback((lecture) => {
        const storedWatched = localStorage.getItem(`watchedTime-${lecture._id}`);
        const watched = storedWatched ? parseFloat(storedWatched) : 0;
        if (!lecture.duration) return 0;
        return Math.min((watched / lecture.duration) * 100, 100);
    }, []);

    const VideoPlayerWithWatermark = memo(({ url, user }) => (
        <div className="relative aspect-video bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            {url ? (
                <>
                    <div className="absolute z-20 text-xs text-white/70 font-medium top-3 right-3 select-none pointer-events-none bg-gray-800/60 px-2 py-1 rounded">
                        {user.name} ({user.email})
                    </div>
                    <video
                        ref={playerRef}
                        src={url}
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                        className="w-full h-full object-contain rounded-xl"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPause={handlePause}
                        onError={handleVideoError}
                    >
                        Your browser does not support the video tag.
                    </video>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                    <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    Loading video...
                </div>
            )}
        </div>
    ));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-8 w-8 text-emerald-500" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span className="text-gray-600 text-lg font-medium">Loading course...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="bg-red-100 text-red-600 px-6 py-4 rounded-lg mb-6 text-lg font-medium max-w-lg text-center">
                    {error}
                </div>
                <button
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
                    onClick={() => navigate(0)}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!videoList.length || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-gray-600 text-lg font-medium max-w-lg text-center">
                    No lectures found for this course.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-emerald-50/20">
            <aside className={`${sidebarCollapsed ? 'lg:w-16' : 'lg:w-96'} w-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden relative`}>
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-colors duration-200 lg:block hidden"
                >
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className={`h-full overflow-y-auto custom-scrollbar p-6 ${sidebarCollapsed ? 'lg:p-2' : ''}`}>
                    <div className={`mb-6 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Course</p>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">{course.title}</h2>
                            </div>
                        </div>

                    </div>
                    <div className={`space-y-1 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                        {course.curriculum?.map((section, idx) => (
                            <div key={section._id || idx} className="mb-4">
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        {section.section}
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2" />
                                </div>
                                <div className="space-y-1">
                                    {section.lectures.map((lecture, lectureIndex) => {
                                        const isActive = activeVideo?._id === lecture._id;
                                        const progress = getLectureProgress(lecture);
                                        const isCompleted = progress >= 97;

                                        return (
                                            <div
                                                key={lecture._id}
                                                className={`group relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${isActive
                                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-[1.02]"
                                                    : "hover:bg-gray-50 hover:shadow-sm"
                                                    }`}
                                                onClick={() =>
                                                    setActiveVideo({
                                                        ...lecture,
                                                        section: section.section,
                                                        courseId: course._id,
                                                        courseTitle: course.title,
                                                    })
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        setActiveVideo({
                                                            ...lecture,
                                                            section: section.section,
                                                            courseId: course._id,
                                                            courseTitle: course.title,
                                                        });
                                                    }
                                                }}
                                                tabIndex={0}
                                                role="button"
                                                aria-label={`Play lecture: ${lecture.title}`}
                                            >
                                                {!isActive && progress > 0 && (
                                                    <div className="absolute bottom-0 left-0 h-1 bg-emerald-200 transition-all duration-300">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center p-3 gap-3">
                                                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`}>
                                                        {isCompleted ? (
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-green-100'
                                                                }`}>
                                                                <svg
                                                                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-600'}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        ) : isActive ? (
                                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-emerald-400 transition-colors duration-200">
                                                                <span className="text-xs font-semibold text-gray-500 group-hover:text-emerald-600">
                                                                    {lectureIndex + 1}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'
                                                            }`}>
                                                            {lecture.title}
                                                        </h4>
                                                        {lecture.duration && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <svg className={`w-3 h-3 ${isActive ? 'text-white/80' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <polyline points="12,6 12,12 16,14" />
                                                                </svg>
                                                                <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                                                    {Math.floor(lecture.duration / 60)}:{String(Math.floor(lecture.duration % 60)).padStart(2, '0')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!isActive && (
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {sidebarCollapsed && (
                        <div className="hidden lg:flex flex-col items-center space-y-4 mt-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            {course.curriculum?.slice(0, 3).map((section, idx) => (
                                <div key={idx} className="w-2 h-2 rounded-full bg-gray-300" />
                            ))}
                        </div>
                    )}
                </div>
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, #3B82F6, #6366F1);
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, #2563EB, #5856EB);
                    }
                `}</style>
            </aside>
            <main className="flex-1 flex flex-col items-center justify-start p-6 lg:p-8">
                <div className="w-full max-w-5xl mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {activeVideo?.title || "Select a lecture"}
                    </h1>
                </div>
                <div className="w-full max-w-5xl">
                    <VideoPlayerWithWatermark url={secureUrl} user={user} />
                </div>

                {/* Watched status */}
                <div className="w-full max-w-5xl mt-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                    <span className="text-gray-600 text-sm font-medium">
                          Watched: {Math.floor(watchedTime / 60)}:{String(Math.floor(watchedTime % 60)).padStart(2, '0')} minutes
                    </span>

                    {completed ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold max-w-max">
                            Completed
                        </span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold max-w-max">
                            In Progress
                        </span>
                    )}

                    <button
                        onClick={handleLike}
                        aria-pressed={liked}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200 ${user.userLikedVideos.includes(activeVideo._id)||liked
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-emerald-100"
                            }`}
                        title="Like"
                    >
                        <ThumbsUp size={20} color="green" />
                        <span className="hidden sm:inline">Like</span>
                    </button>
                </div>

                

                <div className="w-full max-w-5xl mt-6 bg-white p-6 rounded-lg shadow-sm">
                    {course.description && (
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
                        </section>
                    )}
                    {course.instructorId && (
                        <section className="flex items-center space-x-4">
                            {course.instructorId.avatar && (
                                <img
                                    src={course.instructorId?.avatar}
                                    alt={`Instructor: ${course.instructorId?.name}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{course.instructorId?.name}</h3>
                            </div>
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                                    />
                                </svg>
                                Message
                            </button>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default memo(CourseVideoPlayer);