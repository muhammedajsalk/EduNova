📺 Course Streaming Feature
This module implements a secure, interactive course video player with watch‑tracking, persistence, progress saving, and a "like feature" for individual lectures. It enhances the student learning experience with a polished front‑end and database‑connected backend updates.

✨ Features
Secure Video Delivery

Requests a secure URL from backend instead of exposing raw video links.
Includes watermark overlay with student’s name & email to discourage piracy.
Watch-Time Tracking & Progress Persistence

Accumulates real watch-time per lecture.
Saves progress frequently to localStorage.
Syncs progress with the backend every few seconds.
Marks completion when 97% watch‑time is reached.
Automatically restores last playback position after reload.
Like System for Lectures

Students can like lectures.
Likes update lecture’s "like count" and user’s liked list in MongoDB (via API).
UI toggles liked state with green "Thumbs Up" button.
Interactive Course Sidebar

Displays curriculum (sections + lectures).
Highlights the active video.
Shows a progress bar beneath partially watched lectures.
Indicates completed lectures with a ✅ checkmark.
Instructor Information & Messaging Shortcut

Sidebar and description panel display instructor info + avatar.
"Message Instructor" button hooks into chat feature integration.
Player Controls with Restrictions

Disabled right-click & certain keyboard shortcuts (to prevent download/inspection).
Disabled native "download" and picture‑in‑picture from <video> control bar.
🏗️ Architecture
1. Frontend – React (CourseVideoPlayer.jsx)
React hooks (useState, useEffect, useRef) maintain watchtime, playback state, and debounce saving.
Secure API call fetches lecture video URL.
Stores local progress (localStorage) and syncs with backend DB.
Debounces save operations with lodash.debounce for efficiency.
Handles like/unlike via POST /api/users/course/like.
UI:
Main player area (VideoPlayerWithWatermark component).
Sidebar lecture navigation with progress indicators.
Course description & instructor info.
2. Backend – Express Controllers
Like Controller (courseLike)
Endpoint: POST /api/users/course/like
Adds lectureId to user.userLikedVideos and increments lecture.like.
Prevents duplicate likes.
Lecture Secure URL Controller (getLectureUrlByCourseTitle)
Endpoint: GET /api/users/course/:courseId/:courseTitle
Finds the lecture by title within a course curriculum and returns its video URL.
Update Watch Time Controller (updateWatchTime)
Endpoint: POST /api/users/course/updateWatchTime
Updates lecture.totalWatchTime in DB.
Called repeatedly in the background while the student watches.
3. Database – MongoDB Schemas (Mongoose)
Lecture Schema
JavaScript

{
  title: String,
  url: String,
  duration: Number,
  totalWatchTime: { type: Number, default: 0 },
  like: { type: Number, default: 0 }
}
User Schema Update
JavaScript

{
  userLikedVideos: [{ type: ObjectId, ref: "Lecture" }]
}
Course Schema
Holds curriculum → list of Sections.
Each section contains an array of lectures.
📡 API Endpoints
Method	Endpoint	Description
POST	/api/users/course/like	Like a lecture (adds to user’s liked list and increments lecture’s like count)
GET	/api/users/course/:courseId/:lectureTitle	Get secure lecture video URL
POST	/api/users/course/updateWatchTime	Update a lecture’s watch-time
⚙️ Usage Flow
Student selects a lecture from the sidebar.
→ GET /api/users/course/:courseId/:lectureTitle returns secure URL.
→ Video loads with watermark overlay of student details.

Streaming begins

As video plays, onTimeUpdate increments "watched duration".
Debounced update sends watchtime to:
POST /api/users/course/updateWatchTime.
Student likes a video

Clicking 👍 sends request to POST /api/users/course/like.
Updates lecture.like count + user.userLikedVideos.
Progress Tracking

Stores progress in localStorage (progress-<lectureId>).
On reload → restores to last playback point.
Marks "Completed" when watchtime >= 97% of lecture duration.
📖 Example Developer Flow
mermaid

sequenceDiagram
    Student->>Frontend: Select Lecture  
    Frontend->>Backend: GET /api/users/course/:courseId/:lectureTitle  
    Backend->>DB: Lookup Lecture URL  
    Backend-->>Frontend: Secure Lecture URL  

    Frontend->>VideoPlayer: Start Playback  
    VideoPlayer->>LocalStorage: Save current progress  
    VideoPlayer->>Backend: POST updateWatchTime (periodic)  

    Student->>Frontend: Click Like 👍  
    Frontend->>Backend: POST /course/like  
    Backend->>DB: Increment lecture.like & save to user.userLikedVideos  
    Backend-->>Frontend: Success  
✅ Next Enhancements
Add dislike support for lectures (UI already partly prepared).
Track per-user completion status at lecture & course level.
Create a certificate unlock logic once entire course is completed.
Enable "resume course" button → jump to last incomplete lecture.
Rich analytics for instructors (who watched what, watch-time per lecture).
