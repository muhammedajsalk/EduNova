const notificationModel=require('../../models/notificationModel')

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = new notificationModel(req.body);
    await notification.save();

    req.io.to(req.body.userId.toString()).emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const archiveNotification = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    await notificationModel.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Notifications deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports={getNotifications,createNotification,markAsRead,deleteNotification,markAllAsRead,archiveNotification,bulkDeleteNotifications}