const express = require('express');
const { getNotifications, createNotification, markAsRead, deleteNotification ,archiveNotification,markAllAsRead,bulkDeleteNotifications} = require('../controllers/notification controller/notificationController');
const router = express.Router()

router.get("/:userId", getNotifications);
router.post("/", createNotification);
router.patch("/read/:id", markAsRead);
router.patch("/read-all/:userId", markAllAsRead);
router.patch("/archive/:id", archiveNotification);
router.delete("/:id", deleteNotification);
router.post("/bulk-delete", bulkDeleteNotifications);



module.exports=router