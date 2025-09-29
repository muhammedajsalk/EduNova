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
import { useParams, useNavigate, Link } from "react-router-dom";
import UserContext from "../../userContext";
import {
    ThumbsUp, ThumbsDown, BookOpen, Clock, PlayCircle,
    CheckCircle2, ChevronLeft, ChevronRight, Award,
    MessageCircle, User, Sparkles, Play, Pause, Volume2
} from 'lucide-react';

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
        axios.post("http://localhost:5000/api/users/course/like", { courseId: activeVideo.courseId, lectureId: activeVideo._id }, { withCredentials: true })
            .then((res) => {})
            .catch((err) => {})
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
                    console.error("Fetch course error");
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

    const newChatCreate = () => {
        axios.post("http://localhost:5000/api/message/chat-room", { userId: user._id, instructorId: course.instructorId?._id }, { withCredentials: true })
            .then((res) => {
                let chatRoomId=res.data?._id
                navigate(`/learningDashboard/studentChat/${course.instructorId?._id}/${chatRoomId}`)
            }
            )
            .catch((err) => {})
    }

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
                    console.error("Fetch video URL error");
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
                            console.error("Error updating watch time");
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
        console.error("Playback error:");
    }, []);

    const getLectureProgress = useCallback((lecture) => {
        const storedWatched = localStorage.getItem(`watchedTime-${lecture._id}`);
        const watched = storedWatched ? parseFloat(storedWatched) : 0;
        if (!lecture.duration) return 0;
        return Math.min((watched / lecture.duration) * 100, 100);
    }, []);

    const VideoPlayerWithWatermark = memo(({ url, user }) => (
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            {url ? (
                <>
                    <div className="absolute z-20 text-xs text-white/60 font-medium top-4 right-4 select-none pointer-events-none bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        {user.name} • {user.email}
                    </div>
                    <video
                        ref={playerRef}
                        src={url}
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                        className="w-full h-full object-contain rounded-2xl"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPause={handlePause}
                        onError={handleVideoError}
                    >
                        Your browser does not support the video tag.
                    </video>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <svg className="relative animate-spin h-12 w-12 text-emerald-400" viewBox="0 0 24 24">
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
                    </div>
                    <p className="mt-4 text-gray-400 font-medium">Loading video...</p>
                </div>
            )}
        </div>
    ));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <svg className="relative animate-spin h-16 w-16 text-emerald-600" viewBox="0 0 24 24">
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
                    </div>
                    <span className="text-gray-700 text-lg font-semibold">Loading course content...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 px-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl mb-6 text-lg font-medium max-w-lg text-center shadow-lg">
                    {error}
                </div>
                <button
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => navigate(0)}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!videoList.length || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 px-4">
                <div className="text-gray-600 text-lg font-medium max-w-lg text-center">
                    No lectures found for this course.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20">
            <aside className={`${sidebarCollapsed ? 'lg:w-20' : 'lg:w-[420px]'} w-full bg-white/90 backdrop-blur-xl border-r border-emerald-100 shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden relative`}>
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute top-6 right-4 z-10 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 lg:block hidden group"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                    )}
                </button>

                <div className={`h-full overflow-y-auto custom-scrollbar p-6 ${sidebarCollapsed ? 'lg:p-3' : ''}`}>
                    <div className={`mb-8 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl blur-lg opacity-50"></div>
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Course</p>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">{course.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <PlayCircle className="w-3 h-3" />
                                        <span>{videoList.length} lectures</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>6h 30m total</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                                <span className="text-sm font-bold text-emerald-600">75%</span>
                            </div>
                            <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={`space-y-2 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                        {course.curriculum?.map((section, idx) => (
                            <div key={section._id || idx} className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        {section.section}
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
                                </div>

                                <div className="space-y-2">
                                    {section.lectures.map((lecture, lectureIndex) => {
                                        const isActive = activeVideo?._id === lecture._id;
                                        const progress = getLectureProgress(lecture);
                                        const isCompleted = progress >= 97;

                                        return (
                                            <div
                                                key={lecture._id}
                                                className={`group relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${isActive
                                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl transform scale-[1.02]"
                                                        : "bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg border border-gray-100 hover:border-emerald-200"
                                                    }`}
                                                onClick={() =>
                                                    setActiveVideo({
                                                        ...lecture,
                                                        section: section.section,
                                                        courseId: course._id,
                                                        courseTitle: course.title,
                                                    })
                                                }
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Play lecture: ${lecture.title}`}
                                            >
                                                {!isActive && progress > 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-100">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center p-4 gap-4">
                                                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`}>
                                                        {isCompleted ? (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                                                                }`}>
                                                                <CheckCircle2 className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                                                            </div>
                                                        ) : isActive ? (
                                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full border-2 border-emerald-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all duration-200">
                                                                <span className="text-sm font-bold text-emerald-600">
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
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`} />
                                                                    <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                                                                        {Math.floor(lecture.duration / 60)}:{String(Math.floor(lecture.duration % 60)).padStart(2, '0')}
                                                                    </span>
                                                                </div>
                                                                {isCompleted && (
                                                                    <span className={`text-xs font-medium ${isActive ? 'text-white/70' : 'text-emerald-600'}`}>
                                                                        Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {!isActive && (
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <PlayCircle className="w-5 h-5 text-emerald-500" />
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
                        <div className="hidden lg:flex flex-col items-center space-y-4 mt-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-3 h-3 rounded-full bg-emerald-300" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, #10b981, #14b8a6);
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, #059669, #0d9488);
                    }
                `}</style>
            </aside>

            <main className="flex-1 flex flex-col p-6 lg:p-10">
                <div className="w-full max-w-6xl mx-auto mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="font-medium text-emerald-600">{activeVideo?.section}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Lecture {videoList.findIndex(v => v._id === activeVideo?._id) + 1}</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {activeVideo?.title || "Select a lecture"}
                    </h1>
                </div>

                <div className="w-full max-w-6xl mx-auto mb-8">
                    <VideoPlayerWithWatermark url={secureUrl} user={user} />
                </div>

                <div className="w-full max-w-6xl mx-auto mb-8">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    <span className="text-gray-700 font-medium">
                                        Watched: {Math.floor(watchedTime / 60)}:{String(Math.floor(watchedTime % 60)).padStart(2, '0')}
                                    </span>
                                </div>

                                {completed ? (
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full">
                                        <Award className="w-4 h-4" />
                                        <span className="text-sm font-bold">Completed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-bold">In Progress</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleLike}
                                    aria-pressed={liked}
                                    className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${user.userLikedVideos?.includes(activeVideo?._id) || liked
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                                            : "bg-white border border-emerald-200 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300"
                                        }`}
                                    title="Like"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Like</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-6xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-emerald-100">
                        {course.description && (
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                                    Course Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
                            </section>
                        )}

                        {course.instructorId && (
                            <section className="border-t border-emerald-100 pt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                                    Your Instructor
                                </h2>
                                <div className="flex items-center gap-6">
                                    {course.instructorId.avatar && (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-lg opacity-30"></div>
                                            <img
                                                src={course.instructorId?.avatar}
                                                alt={`Instructor: ${course.instructorId?.name}`}
                                                className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{course.instructorId?.name}</h3>
                                        <p className="text-gray-600 mt-1">Course Instructor</p>
                                    </div>
                                    <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" onClick={()=>newChatCreate()}>
                                        <MessageCircle className="w-5 h-5" />
                                            <span>Message</span>
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default React.memo(CourseVideoPlayer);