const { default: mongoose } = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }]
  },
  { timestamps: true }
);

const chatRoomModel = mongoose.model("chatRoom", chatRoomSchema);
module.exports = chatRoomModel;
